import dotenv from "dotenv";
import path from "path";
const env = process.env.NODE_ENV || "dev";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`),
});
console.log("process.env.PORT", process.env.COOKIE_DOMAIN);

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
    origin: process.env.FRONTEND_URL || "https://localhost:3000",
  },
  fast2sms: {
    apiKey: process.env.FAST2SMS_API_KEY || "",
    senderId: process.env.FAST2SMS_SENDER_ID || "DESSY69",
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN || "localhost"
  },
};
