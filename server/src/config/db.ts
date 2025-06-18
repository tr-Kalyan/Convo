import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path:"../../.env"})

const dbConnect = async () => {
    try{
        mongoose.connection.on('connection',() => console.log("Database connected"))

        await mongoose.connect(`${process.env.DB_URL}`)
    }
    catch(err){
        console.log("Error while connected to database",err)
    }
}

export default dbConnect