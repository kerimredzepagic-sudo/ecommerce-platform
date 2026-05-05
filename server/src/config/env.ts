import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const env = {
  // Server
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  // MongoDB
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/shopkit",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "default-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // SMTP / Email
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "ShopKit <noreply@shopkit.ba>",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@shopkit.ba",

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
} as const;

export function validateEnv(): void {
  if (env.isProduction) {
    const requiredVars = ["MONGODB_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
    const missing = requiredVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`,
      );
    }
  }
}
