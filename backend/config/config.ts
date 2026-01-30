import { config } from "dotenv";

config();

export const ENV = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/mydb",
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
};