import express from "express";

const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Get all services" });
});

export default router;
