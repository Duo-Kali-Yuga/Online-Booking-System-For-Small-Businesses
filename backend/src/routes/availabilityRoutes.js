import express from "express";
import {
  setAvailability,
  getAvailability,
} from "../controllers/availabilityController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, setAvailability);
router.get("/:providerId", getAvailability);

export default router;