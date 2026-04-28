import express from "express";
import {
  createProvider,
  getMyProvider,
  getProviders,
  getProviderById,
  updateProviderProfile,
  updateMe
} from "../controllers/providerController.js";
import {
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protect, isProvider } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";



const router = express.Router();

router.get("/", getProviders);

router.post("/", protect, isProvider, createProvider);
router.get("/me", protect, isProvider, getMyProvider);
router.get("/:id", getProviderById);
router.patch('/:id/status', protect, isProvider, updateAppointmentStatus);
router.patch("/profile", protect, upload.single('avatar'), isProvider, updateProviderProfile);
router.patch('/set', protect, updateMe);

export default router;