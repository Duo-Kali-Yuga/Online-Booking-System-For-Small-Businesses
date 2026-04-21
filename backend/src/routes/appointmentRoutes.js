import express from "express";
import { bookAppointment } from "../controllers/appointmentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { cancelAppointment, rescheduleAppointment } from "../controllers/appointmentController.js";
import {
  createAppointmentSchema,
  rescheduleSchema,
} from "../validators/appointmentValidator.js";



const router = express.Router();

router.post("/", protect, validate(createAppointmentSchema), bookAppointment);
router.patch("/:id/cancel", protect, cancelAppointment);
router.patch(
  "/:id/reschedule",
  protect,
  validate(rescheduleSchema),
  rescheduleAppointment
);



export default router;






