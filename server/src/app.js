import express from "express";
import cors from "cors";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/services", serviceRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "RiderLens API is running" });
});

export default app;
