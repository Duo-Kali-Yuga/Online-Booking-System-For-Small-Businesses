import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "client", "provider"],
      default: "client",
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

// models/User.js
userSchema.pre('save', async function () {
  // 1. Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;

  try {
    // 2. Generate salt and hash
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // 3. No next() needed here; Mongoose waits for the async function to resolve
  } catch (err) {
    // 4. If an error occurs, throwing it will stop the save process
    throw err;
  }
});

export default mongoose.model("User", userSchema);