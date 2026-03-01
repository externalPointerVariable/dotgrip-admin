import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const protect = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!userExists(decoded.userId)) {
      return res.status(401).json({ message: "Unauthorized: User does not exist" });
    }
    if (decoded.role === "admin") {
      console.log({message: "Admin access granted"});
      next();
    }
  } catch (error:any) {
    console.error("JWT error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const userExists = async (id: string) => {
  try {
    const user = await UserModel.findById(id);
    return !!user;
  } catch (error: any) {
    console.error("User existence check error:", error.message);
    throw error;
  }
};
export default protect;