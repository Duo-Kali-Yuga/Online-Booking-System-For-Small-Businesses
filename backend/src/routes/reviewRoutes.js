import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createReview,
  getProviderReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:providerId", getProviderReviews);

export default router;