import mongoose from "mongoose";

const breakSchema = new mongoose.Schema(
  {
    start: String,
    end: String,
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: Number, // 0 (Sunday) - 6 (Saturday)
      required: true,
    },
    startTime: {
      type: String, // "09:00"
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    breaks: [breakSchema],
  },
  { timestamps: true }
);

availabilitySchema.index({ provider: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);