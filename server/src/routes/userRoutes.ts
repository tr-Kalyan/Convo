import {Router} from 'express';
import { protectRoute } from "../middleware/auth";
import { signup,login,checkAuth,updateProfile } from '../controllers/userController';
import { sign } from 'crypto';

const userRouter = Router()


userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.put("/update-profile",protectRoute,updateProfile)
userRouter.get("/check",protectRoute,checkAuth)

export default userRouter;