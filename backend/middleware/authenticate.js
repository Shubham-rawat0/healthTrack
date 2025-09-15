import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; 

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next(); 
  } catch (error) {
    console.error("token error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
