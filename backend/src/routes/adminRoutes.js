// backend/routes/adminRoutes.js
import express from "express";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getAllProviders,
  toggleProviderStatus,
  getAllAppointments,
  deleteUser,
  getAdminStats, // Make sure this is exported in your controller
  deleteAppointment
} from "../controllers/adminController.js";

const router = express.Router();

// Apply protection to all routes in this file
// router.use(protect);
// router.use(isAdmin);

/**
 * @desc    System Statistics & Overview
 * @route   GET /api/admin/stats
 */
router.get("/stats", getAdminStats);

/**
 * @desc    User Management
 * @route   GET /api/admin/users
 * @route   DELETE /api/admin/users/:id
 */
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

/**
 * @desc    Provider Management
 * @route   GET /api/admin/providers
 * @route   PATCH /api/admin/providers/:id/toggle
 */
router.get("/providers", getAllProviders);
router.patch("/providers/:id/toggle", toggleProviderStatus);

/**
 * @desc    Global Appointment Oversight
 * @route   GET /api/admin/appointments
 */
router.get("/appointments", getAllAppointments);


router.delete("/appointments/:id", protect, isAdmin, deleteAppointment);

export default router;

