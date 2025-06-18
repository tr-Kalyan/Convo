import {Request,Response,NextFunction} from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config({path:"../../.env"})


export const verifyToken = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return res.status(200).json({ message: "Token is valid", userID: decoded });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// useEffect(() => {
//   axios.get("/api/auth/verify-token", { withCredentials: true })
//     .then(() => navigate("/dashboard"))
//     .catch(() => navigate("/login")); // or do nothing
// }, []); 