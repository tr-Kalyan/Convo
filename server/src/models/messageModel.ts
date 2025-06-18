import mongoose from 'mongoose';
import userModel from './userModel';

const messageSchema = new mongoose.Schema({
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    receiverId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    text:{type:String},
    image:{type:String},
    seen:{type:Boolean,default:false}

},{timestamps:true})

const messageModel = mongoose.model("Message",messageSchema)

export default messageModel;