import express from "express";
import {
  setAvailability,
  getAvailability,
  getMyAvailability
} from "../controllers/availabilityController.js";
import { protect, isProvider } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isProvider, setAvailability);
router.get("/me", protect, isProvider, getMyAvailability);
router.get("/:providerId", getAvailability);

export default router;