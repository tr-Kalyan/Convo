import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController";

const messageRouter = Router()

messageRouter.get("/user",protectRoute,getUserForSidebar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter;
