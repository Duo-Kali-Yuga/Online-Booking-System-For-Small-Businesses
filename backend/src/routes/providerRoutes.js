import express from "express";
import {
  createProvider,
  getMyProvider,
  getProviders,
  getProviderById,
  updateProviderProfile
} from "../controllers/providerController.js";
import {
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protect, isProvider } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProviders);

router.post("/", protect, isProvider, createProvider);
// router.get("/me", protect, isProvider, getMyProvider);
router.get("/:id", getProviderById);
router.patch('/:id/status', protect, isProvider, updateAppointmentStatus);
router.patch("/profile", protect, isProvider, updateProviderProfile);

export default router;