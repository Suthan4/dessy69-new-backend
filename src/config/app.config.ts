import dotenv from "dotenv";
dotenv.config();
import {} from "jsonwebtoken"

export const AppConfig = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/dessy69_icecream",
  jwt: {
    secret: process.env.JWT_SECRET || "change-this-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
};
