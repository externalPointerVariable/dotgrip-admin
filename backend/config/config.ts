import { config } from "dotenv";

config();

export const ENV = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/dotGripAdmin",
  JWT_SECRET: process.env.JWT_SECRET || "changeme",
  APIFY_API_TOKEN: process.env.SCRAPER_API || "your_apify_api_token_here",
};
