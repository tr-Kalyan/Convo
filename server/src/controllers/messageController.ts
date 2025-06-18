import {Request,Response} from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import userModel from '../models/userModel';
import messageModel from '../models/messageModel';
import cloudinary from '../utils/cloudinary';
import {io,userSocketMap} from "../server"

// Get all users except the logged in user

export const getUserForSidebar = async (req:AuthenticatedRequest,res:Response) => {

    try{
        const userId = req.userID;
        const filteredUsers = await userModel.find({_id:{$ne:userId}}).select("-password")

        // count of unseen messages

        const unseenMessages :{[key:string]:number} = {}
        const promises = filteredUsers.map(async(user) => {
            const messages = await messageModel.find({senderId:user._id,receiverId:userId,seen:false})

            if(messages.length > 0){
                unseenMessages[user._id.toString()] = messages.length
            }
        })

        await Promise.all(promises)

        res.status(200).json({success:true,users:filteredUsers,unseenMessages})
    }
    catch(err){

        console.log(err)
        res.status(500).json({success:false,err})
    }
}


// Get all messages for selected users

export const getMessages  = async(req:AuthenticatedRequest,res:Response) => {

    try{
        const {id:selectedUserId} = req.params;

        const myId = req.userID

        const messages = await messageModel.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
        })

        await messageModel.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true})

        res.status(200).json({success:true,messages})
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,err})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req:Request,res:Response) => {

    try{
        const {id} = req.params;

        await messageModel.findByIdAndUpdate(id,{seen:true})

        res.status(200).json({success:true})
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,err})
    }
}

// send message to selected user

export const sendMessage = async (req:AuthenticatedRequest,res:Response) => {

    try{

        const {text,image} = req.body;

        const receiverId = req.params.id;

        const senderId = req.userID;

        let imageUrl;

        if (image){
            const uploadResponse = await cloudinary.uploader.upload(image);

            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await messageModel.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        // emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];

        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(200).json({success:true,newMessage})
    }
    catch(err){
        console.log(err)
        res.status(500).json({success:false,err})
    }
}