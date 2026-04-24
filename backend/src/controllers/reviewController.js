import Review from "../models/Review.js";
import Appointment from "../models/Appointment.js";
import Provider from "../models/Provider.js";


export const createReview = async (req, res) => {
  const { providerId, rating, comment, appointmentId } = req.body;

  try {
    // 1. Check if appointment exists and belongs to the user
    const appointment = await Appointment.findOne({ 
      _id: appointmentId, 
      client: req.user._id 
    });

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // 2. Create the review
    const review = await Review.create({
      client: req.user._id,
      provider: providerId,
      appointment: appointmentId,
      rating,
      comment
    });

    // 3. Mark appointment as reviewed so the button disappears in UI
    appointment.isReviewed = true;
    await appointment.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this appointment" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getProviderReviews = async (req, res) => {
  const reviews = await Review.find({
    provider: req.params.providerId,
  }).populate("client", "name");

  console.log(reviews)

  res.json({ success: true, data: reviews });
};

// Function to get provider stats
export const getProviderStats = async (providerId) => {
  const stats = await Review.aggregate([
    {
      // 1. Filter reviews for this specific provider
      $match: { provider: new mongoose.Types.ObjectId(providerId) }
    },
    {
      // 2. Calculate average and total count
      $group: {
        _id: "$provider",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return stats.length > 0 
    ? { averageRating: stats[0].averageRating.toFixed(1), totalReviews: stats[0].totalReviews }
    : { averageRating: 0, totalReviews: 0 };
};

// backend/controllers/reviewController.js
export const respondToReview = async (req, res) => {
  const { reviewId } = req.params;
  const { response } = req.body;

  try {
    const review = await Review.findById(reviewId);
    
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Ensure the person responding is the actual provider for this review
    // This assumes req.user._id is the User ID linked to the Provider
    review.response = response;
    review.respondedAt = Date.now();
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviewReceive = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const reviews = await Review.find({ provider: provider._id })
      .populate("client", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


