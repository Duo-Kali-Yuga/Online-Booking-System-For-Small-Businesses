import express from "express";
import {
  createProvider,
  getMyProvider,
  getProviders
} from "../controllers/providerController.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProviders);

router.post("/", protect, isAdmin, createProvider);
router.get("/me", protect, isAdmin, getMyProvider);

export default router;