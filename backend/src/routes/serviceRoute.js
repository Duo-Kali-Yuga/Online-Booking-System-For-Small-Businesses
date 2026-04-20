import express from "express";
import {
  createService,
  getMyServices,
  deleteService,
} from "../controllers/serviceController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createService);
router.get("/:providerId", getMyServices);
router.delete("/:id", protect, isAdmin, deleteService);

export default router;