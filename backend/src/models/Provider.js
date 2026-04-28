import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      enum: ['healthcare', 'beauty', 'education', 'consulting', 'Fitness', 'other'],
      default: 'other'
    },
    description: String,
    location: {
      address: String,
      city: String,
      country: String,
    },
    avatar: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    ratingStats: {
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    },
    settings: {
        bufferTime: { type: Number, default: 10 },
        operatingHours: [
          {
            dayOfWeek: Number, // 0-6
            dayName: String,
            isOpen: { type: Boolean, default: true },
            startTime: { type: String, default: "09:00" },
            endTime: { type: String, default: "17:00" },
            breaks: [
            {
              start: String,
              end: String
            }
          ]
        }
      ]
    }
  },
  { timestamps: true }
);

providerSchema.index({ 
  businessName: 'text', 
  industry: 'text', 
  description: 'text' 
}, {
  weights: {
    businessName: 10, // Give higher priority to the name
    industry: 5,
    description: 1
  },
  name: "ProviderSearchIndex"
});

export default mongoose.model("Provider", providerSchema);