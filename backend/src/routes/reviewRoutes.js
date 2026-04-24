import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createReview,
  getProviderReviews,
  respondToReview,
  getAllReviewReceive
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:providerId", getProviderReviews);

// Get reviews for the logged-in provider
// router.get("/me/my-reviews", protect, async (req, res) => {
//   const provider = await Provider.findOne({ user: req.user._id });
//   const reviews = await Review.find({ provider: provider?._id })
//     .populate("client", "name")
//     .sort({ createdAt: -1 });
//   res.json({ success: true, data: reviews });
// });
// router.get("/me/my-reviews", protect, respondToReview);

// GET reviews (No body allowed here)
router.get("/me/my-reviews", protect, getAllReviewReceive);

// PATCH response (Body allowed here)
router.patch("/:reviewId/respond", protect, respondToReview);

export default router;