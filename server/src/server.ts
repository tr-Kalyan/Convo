import express, { Request,Response } from 'express';
import "dotenv/config";
import cors from 'cors';
import http from "http";
import dbConnect from './config/db';
import userRouter from './routes/userRoutes';
import messageRouter from './routes/messageRoutes';
import {Server} from 'socket.io'
import cookieParser from 'cookie-parser';
// create Express app and HTTP server

const app = express()
const server = http.createServer(app)

// initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

// store online users
export const userSocketMap: Record<string, string> = {}; //{userId:socketId}

// socket.io connection handler
io.on("connection",(socket) => {
     const userId = Array.isArray(socket.handshake.query.userID)
        ? socket.handshake.query.userID[0] // Take the first if it's an array
        : socket.handshake.query.userID; // Otherwise, use it directly

    // Convert userId to string if it's not already, and handle potential null/undefined
    const userIdString = userId ? String(userId) : null;

    console.log("User connected", userIdString);

    if (userIdString) {
        userSocketMap[userIdString] = socket.id;
    }

    // emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", userIdString);
        if (userIdString) {
            delete userSocketMap[userIdString];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})



// Middleware setup

app.use(cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true,
}));
app.use(express.json({limit:"4mb"}))

app.use(cookieParser())

// connect to database
dbConnect();

app.use("/api/status", (req:Request,res:Response) => {res.send("Server is live")});
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))