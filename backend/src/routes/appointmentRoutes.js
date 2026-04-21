import express from "express";
import { bookAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { cancelAppointment, rescheduleAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", protect, bookAppointment);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch("/:id/reschedule", protect, rescheduleAppointment);

export default router;