import mongoose from "mongoose";
import { ENV } from "../config/config";


export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
