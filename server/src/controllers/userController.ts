import userModel from "../models/userModel";
import { Request,Response } from 'express';
import bcrypt from 'bcrypt'
import { generateToken } from "../utils/tokenGenerate";
import { AuthenticatedRequest } from "../middleware/auth";
import cloudinary from "../utils/cloudinary";



export const signup = async (req:Request,res:Response): Promise<void> => {
    const {fullName,email,password,bio} = req.body;

    try{
        if ((!fullName || !email || !password || !bio)){
            res.status(400).json({success:false,message:"Missing details"})
            return
        }

        // check if email already exist in database
        const user = await userModel.findOne({email})

        if(user){
            res.status(409).json({success:false,message:"Account already exist"})
            return
        }

        //hashing password
        const hashPassword = await bcrypt.hash(password,10);

        const newUser = new userModel({
            fullName:fullName,
            email:email,
            password:hashPassword,
            bio:bio
        })

        await newUser.save()

        
        // generate jwt token
        const token = generateToken(newUser._id.toString())

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
            path: "/",
        });

        res
            .status(200)
            .json({
                success:true,
                message: "User successfully created",
                userData: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                } 
            })
    }
    catch(err){

        res.status(500).send({
            success:false,
            message : `Something went wrong while registration: ${err}`
        })
        return;
    }
}

export const login = async (req:Request,res:Response):Promise<void> => {
    try{

        const {email,password} = req.body;

        //check whether all fields are filled or not

        if (!email || !password){
            res.status(400).json({
                message:"All fields are required"
            })
            return;
        }

        const User = await userModel.findOne({email})

        if (!User || !User.password){
            res.status(404).json({
                message:"User not found or missing credentials"
            })
            return;
        }

        const isMatch = await bcrypt.compare(password,User.password)
        
        if (!isMatch){
            res.status(401).json({
                message:"Invalid credentials"
            })
            return
        }

        // generate jwt token
        const token = generateToken(User._id.toString())
        
        // Set token in HttpOnly cookie for 1 hour (3600000 ms)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
            path: "/",
        });

        res
            .status(200)
            .json({
                success:true,
                message:"Login successful",
                userData: {
                    _id: User._id,
                    fullName: User.fullName,
                    email: User.email,
                },
        })
    }
    catch(err){

        res.status(500).json({
        message: `Something went wrong during signin ${err}`
        })
       
    }
}

// check if user is authenticated

export const checkAuth = async (req:AuthenticatedRequest,res:Response): Promise<void> => {
    
    const user = await userModel.findById(req.userID).select("-password")
    
    res.json({success:true,user:user});
}


// controller to update user profile details

export const updateProfile = async (req:AuthenticatedRequest,res:Response) => {
    try{
        const {profilePic,bio,fullName} = req.body;

        const userId = req.userID
        
        let updatedUser;

        if (!profilePic){
            updatedUser = await userModel.findByIdAndUpdate(userId,{bio,fullName},{new:true,select:"-password"})
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await userModel.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true,select:"-password"})
        }
        
        res.status(200).json({message:true,user:updatedUser})
    }
    catch(err){
        res.status(500).json({success:false,message:err})
    }
}