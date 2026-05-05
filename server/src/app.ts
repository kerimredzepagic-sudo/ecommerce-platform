import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env, validateEnv, connectDatabase } from "./config";
import { apiRoutes } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware";

// Validate environment variables
validateEnv();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  env.corsOrigin,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
        console.log("CORS request from:", origin);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api", apiRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "ShopKit API",
    version: "1.0.0",
    description: "Backend API for ShopKit e-commerce platform",
    documentation: "/api/health",
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      console.log(`
  ShopKit Server is running!
  Environment: ${env.nodeEnv}
  URL: http://localhost:${env.port}
  API: http://localhost:${env.port}/api
  Health: http://localhost:${env.port}/api/health
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
