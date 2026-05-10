import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { getStats, getConstants } from "./controllers/serviceController.js";

const app = express();

// ── Security headers
app.use(helmet());

// ── Body parser
app.use(express.json());

// ── CORS setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Logging (only in dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Rate limiter (auth protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20,
  message: { message: "Too many requests, please try again later" },
});

// ── Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

// ── Public routes
app.get("/api/stats", getStats);
app.get("/api/constants", getConstants);

// ── Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV,
  });
});

// ── ROOT ROUTE (IMPORTANT: before 404 handler)
app.get("/", (req, res) => {
  res.json({
    message: "AbilityMap API is running 🚀",
  });
});

// ── 404 handler (MUST be last before error handler)
app.use(notFound);

// ── Global error handler (LAST)
app.use(errorHandler);

export default app;
