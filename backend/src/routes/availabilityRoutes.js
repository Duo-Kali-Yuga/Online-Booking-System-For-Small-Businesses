import express from "express";
import {
  setAvailability,
  getAvailability,
} from "../controllers/availabilityController.js";
import { protect, isProvider } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isProvider, setAvailability);
router.get("/:providerId", getAvailability);

export default router;