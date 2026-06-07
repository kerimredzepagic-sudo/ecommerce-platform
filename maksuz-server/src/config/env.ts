import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const env = {
  // Server
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  // MongoDB
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/maksuz",

  // JWT
  jwtSecret: process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "default-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h", // Increased from 15m for better UX
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "default-refresh-secret-change-me",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Google Cloud Storage
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || "",
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || "maksuz",
  GCS_KEY_FILE: process.env.GCS_KEY_FILE || "",
  GCS_CREDENTIALS_BASE64: process.env.GCS_CREDENTIALS_BASE64 || "",

  // SMTP / Email
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "Maksuz <noreply@maksuz.ba>",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "amelzekovic123@hotmail.com",

  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
} as const;

// Validate required environment variables in production
export function validateEnv(): void {
  if (env.isProduction) {
    // Check for JWT secret (either JWT_SECRET or JWT_ACCESS_SECRET)
    const hasJwtSecret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
    
    const requiredVars = ["MONGODB_URI", "JWT_REFRESH_SECRET"];
    const missing = requiredVars.filter((key) => !process.env[key]);

    if (!hasJwtSecret) {
      missing.push("JWT_SECRET or JWT_ACCESS_SECRET");
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`,
      );
    }
  }
}
