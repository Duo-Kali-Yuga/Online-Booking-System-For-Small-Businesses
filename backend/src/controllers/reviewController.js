import Review from "../models/Review.js";
import Appointment from "../models/Appointment.js";

// export const createReview = async (req, res) => {
//   const { providerId, rating, comment, appointmentId } = req.body;

//   // 🔒 ensure appointment belongs to user
//   const appointment = await Appointment.findOne({
//     _id: appointmentId,
//     client: req.user.id,
//     status: "confirmed",
//   });

//   if (!appointment) {
//     return res.status(400).json({
//       success: false,
//       message: "You can only review completed appointments",
//     });
//   }

//   const existing = await Review.findOne({ appointment: appointmentId });

//   if (existing) {
//     return res.status(400).json({
//       success: false,
//       message: "Already reviewed",
//     });
//   }

//   const review = await Review.create({
//     client: req.user.id,
//     provider: providerId,
//     rating,
//     comment,
//     appointment: appointmentId,
//   });

//   res.json({ success: true, data: review });
// };

// export const createReview = async (req, res) => {
//   const { providerId, rating, comment, appointmentId } = req.body;

//   // 1. Authorization & Validity Check
//   const appointment = await Appointment.findOne({
//     _id: appointmentId,
//     client: req.user._id, // Use _id to match your JWT payload
//   });

//   if (!appointment) {
//     return res.status(404).json({ message: "Appointment not found" });
//   }

//   // 2. Prevent Duplicate Reviews
//   const existing = await Review.findOne({ appointment: appointmentId });
//   if (existing) {
//     return res.status(400).json({ message: "You have already reviewed this visit" });
//   }

//   // 3. Create Review
//   const review = await Review.create({
//     client: req.user._id,
//     provider: providerId,
//     appointment: appointmentId,
//     rating,
//     comment,
//   });

//   // 4. Optional: Update Appointment to hide the button on next fetch
//   await Appointment.findByIdAndUpdate(appointmentId, { isReviewed: true });

//   res.status(201).json({ success: true, data: review });
// };

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