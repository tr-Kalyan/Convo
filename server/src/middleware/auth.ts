import {Request,Response,NextFunction} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {Types} from 'mongoose';
import userModel from '../models/userModel';
import dotenv from 'dotenv'

dotenv.config({path:"../.env"})

export interface AuthenticatedRequest extends Request{
    userID?:String |JwtPayload;
}

export const protectRoute = async (req:AuthenticatedRequest,res:Response,next:NextFunction) => {
    try{
        const {token} = req.cookies;

        

        if(!token){
            res.status(401).json({
                message:"Bad token request"
            })
            
            return
        }

        const secretKey = process.env.JWT_KEY

        if (!secretKey){
            res.status(500).json({
                message:"internal server problem"
            })
            return
            
        }

        

        const decoded = jwt.verify(token,secretKey) as unknown as {userId:Types.ObjectId}

        req.userID = decoded.userId

        return next()
    }   
    catch(err){
        res.status(401).json({
            message:`Unauthorized: Invalid or expired token ${err}`
        })
        return
    }

}