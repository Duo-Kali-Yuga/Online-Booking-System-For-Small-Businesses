import express from "express";
import {
  createService,
  getMyServices,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { serviceSchema } from "../validators/serviceValidator.js";
import { validate } from "../middlewares/validate.js";
import { serviceSchema } from "../validators/serviceValidator.js";


const router = express.Router();

router.post("/", protect, isAdmin, validate(serviceSchema), createService);
router.get("/:providerId", getMyServices);
router.delete("/:id", protect, isAdmin, deleteService);

export default router;