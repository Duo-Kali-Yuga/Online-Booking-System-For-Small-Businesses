import express from "express";
import {
  createService,
  getMyServices,
  deleteService,
  getMyServicesMe,
} from "../controllers/serviceController.js";
import { protect, isProvider } from "../middlewares/authMiddleware.js";
import { serviceSchema } from "../validators/serviceValidator.js";
import { validate } from "../middlewares/validate.js";



const router = express.Router();

router.post("/", protect, isProvider, validate(serviceSchema), createService);
// router.get("/:providerId", getMyServices);
router.delete("/:id", protect, isProvider, deleteService);
router.get('/me', protect, getMyServicesMe);



export default router;