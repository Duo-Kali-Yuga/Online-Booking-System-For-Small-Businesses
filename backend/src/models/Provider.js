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
      enum: ["doctor", "barber", "salon", "consultant", "other"],
    },
    description: String,
    location: {
      address: String,
      city: String,
      country: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);