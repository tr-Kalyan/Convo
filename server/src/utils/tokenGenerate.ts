import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config({path:"../../.env"})

export const generateToken = (userId:string) => {

    const secretKey = process.env.JWT_KEY

    if (secretKey){
        const token = jwt.sign({userId},secretKey,{expiresIn:"1h"});
        return token;
    }
    
    
}