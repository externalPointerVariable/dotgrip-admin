import mongoose from "mongoose";
import { config } from "dotenv";

config();

const MONGO_URI =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/dotGripAdmin";

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
