import mongoose, {mongo} from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minLength:8},
    profilePic:{type:String,default:""},
    bio:{type:String}
},{timestamps:true})

const userModel = mongoose.models.User || mongoose.model("User",userSchema)

export default userModel;