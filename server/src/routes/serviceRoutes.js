import express from "express";
import {
  getServices,
  getFeaturedServices,
  getServiceById,
  createService,
  updateServiceStatus,
  updateService,
  deleteService,
  getAdminServices,
  toggleFeatured,
} from "../controllers/serviceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/featured", getFeaturedServices);
router.get("/:id", getServiceById);

// Protected — logged-in users
router.post("/", protect, createService);

// Admin only
router.patch("/:id/status", protect, adminOnly, updateServiceStatus);
// Add before the /:id route to avoid conflict
router.get("/admin/all", protect, adminOnly, getAdminServices);
router.put("/:id", protect, adminOnly, updateService);
router.delete("/:id", protect, adminOnly, deleteService);
router.patch("/:id/feature", toggleFeatured);

export default router;
