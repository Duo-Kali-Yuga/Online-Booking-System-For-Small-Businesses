import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    response: {
      type: String,
      default: ""
    },
    respondedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

reviewSchema.index({ appointment: 1 }, { unique: true });

// Add this static method BEFORE the model export
reviewSchema.statics.calculateAverageRating = async function(providerId) {
  const stats = await this.aggregate([
    { $match: { provider: providerId } },
    {
      $group: {
        _id: '$provider',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Provider').findByIdAndUpdate(providerId, {
      'ratingStats.totalReviews': stats[0].nRating,
      'ratingStats.averageRating': stats[0].avgRating.toFixed(1)
    });
  } else {
    await mongoose.model('Provider').findByIdAndUpdate(providerId, {
      'ratingStats.totalReviews': 0,
      'ratingStats.averageRating': 0
    });
  }
};

// Trigger calculateAverageRating after a new review is saved
reviewSchema.post('save', function() {
  // 'this' points to the current review
  this.constructor.calculateAverageRating(this.provider);
});

// Optional: Trigger if a review is deleted
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.provider);
});

export default mongoose.model("Review", reviewSchema);