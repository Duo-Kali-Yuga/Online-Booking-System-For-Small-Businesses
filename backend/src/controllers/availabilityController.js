import Availability from "../models/Availability.js";
import Provider from "../models/Provider.js";
import * as availabilityService from "../services/availabilityService.js";

console.log("🛠️ Availability Controller File Loaded");

// GET public availability by providerId
export const getAvailability = async (req, res) => {
  try {
    const data = await availabilityService.getAvailability(
      req.params.providerId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST set/update availability (Upsert logic)
export const setAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, breaks } = req.body;

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const availability = await Availability.findOneAndUpdate(
      { provider: provider._id, dayOfWeek },
      { startTime, endTime, breaks },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET own availability for the logged-in provider
export const getMyAvailability = async (req, res) => {
  try {
    console.log("Fetching availability for User ID:", req.user?._id);

    // 1. Find the provider
    const provider = await Provider.findOne({ user: req.user._id });
    
    if (!provider) {
      console.log("❌ Provider profile not found for this user");
      return res.status(404).json({ success: false, message: "Provider profile not found" });
    }

    console.log("✅ Found Provider:", provider.businessName);

    // 2. Find availability
    const availability = await Availability.find({ provider: provider._id });
    
    return res.json({ success: true, data: availability });
  } catch (error) {
    console.error("🔥 SERVER ERROR IN getMyAvailability:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAvailability = async (req, res) => {
  const { dayOfWeek } = req.params;

  console.log("DELETE request for day:", dayOfWeek);
  console.log("USER:", req.user._id);

  const provider = await Provider.findOne({ user: req.user._id });
  
  if (!provider) return res.status(404).json({ message: "Provider not found" });


  const result = await Availability.findOneAndDelete({
    provider: provider._id,
    dayOfWeek: Number(dayOfWeek), // 🔥 IMPORTANT
  });

  console.log("DELETE RESULT:", result);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "No availability found for this day",
    });
  }

  res.json({ success: true, message: "Deleted" });
};