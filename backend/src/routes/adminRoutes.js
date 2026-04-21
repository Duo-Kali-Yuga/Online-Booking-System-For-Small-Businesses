import express from "express";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getAllProviders,
  toggleProviderStatus,
  getAllAppointments,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.get("/providers", protect, isAdmin, getAllProviders);
router.patch("/providers/:id/toggle", protect, isAdmin, toggleProviderStatus);
router.get("/appointments", protect, isAdmin, getAllAppointments);

export default router;