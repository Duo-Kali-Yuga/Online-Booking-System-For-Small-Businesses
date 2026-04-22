import Review from "../models/Review.js";
import Appointment from "../models/Appointment.js";

export const createReview = async (req, res) => {
  const { providerId, rating, comment, appointmentId } = req.body;

  // 🔒 ensure appointment belongs to user
  const appointment = await Appointment.findOne({
    _id: appointmentId,
    client: req.user.id,
    status: "confirmed",
  });

  if (!appointment) {
    return res.status(400).json({
      success: false,
      message: "You can only review completed appointments",
    });
  }

  const existing = await Review.findOne({ appointment: appointmentId });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Already reviewed",
    });
  }

  const review = await Review.create({
    client: req.user.id,
    provider: providerId,
    rating,
    comment,
    appointment: appointmentId,
  });

  res.json({ success: true, data: review });
};

export const getProviderReviews = async (req, res) => {
  const reviews = await Review.find({
    provider: req.params.providerId,
  }).populate("client", "name");

  res.json({ success: true, data: reviews });
};