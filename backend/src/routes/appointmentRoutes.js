import express from "express";
import { bookAppointment } from "../controllers/appointmentController.js";
import { cancelAppointment, rescheduleAppointment } from "../controllers/appointmentController.js";
import {
  createAppointmentSchema,
  rescheduleSchema
} from "../validators/appointmentValidator.js";
import { validate } from "../middlewares/validate.js";
import { getProviderAppointments, getClientAppointments, deleteAppointment, updateAppointmentStatus } from "../controllers/appointmentController.js";
import { protect, isProvider } from "../middlewares/authMiddleware.js";


const router = express.Router();

// router.post("/", protect, validate(createAppointmentSchema), bookAppointment);
router.post("/", protect, bookAppointment);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch(
  "/:id/reschedule",
  protect,
  validate(rescheduleSchema),
  rescheduleAppointment
);
router.patch("/:id/status", protect, isProvider,updateAppointmentStatus);
router.get("/provider-bookings", protect, isProvider, getProviderAppointments);
router.get("/my-bookings", protect, getClientAppointments);
router.delete("/:id", protect, deleteAppointment);



export default router;
