import { UserModel } from "../models/user.model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ENV } from "../config/config";
import express from "express";

export class AuthController {
  private static readonly SALT_ROUNDS = 10;

  private static generateToken(userId: string, role: string) {
    return jwt.sign({ userId, role }, ENV.JWT_SECRET, { expiresIn: "24h" });
  }

static async register(req: express.Request, res: express.Response) {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(AuthController.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();

    return res.status(204).json({ Message: "User registered successfully"});
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

  
  static async login(req: express.Request, res: express.Response) {
    try {
      const { usernameOrEmail, password } = req.body;

      const user = await UserModel.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = AuthController.generateToken(user._id.toString(), user.role);

      return res.status(200).json({ token });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, ENV.JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }
}