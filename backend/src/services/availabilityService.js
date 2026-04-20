import Availability from "../models/Availability.js";
import Provider from "../models/Provider.js";

export const setAvailability = async (userId, data) => {
  const provider = await Provider.findOne({ user: userId });
  if (!provider) throw new Error("Provider not found");

  const { dayOfWeek, startTime, endTime, breaks } = data;

  const availability = await Availability.findOneAndUpdate(
    { provider: provider._id, dayOfWeek },
    {
      startTime,
      endTime,
      breaks: breaks || [],
    },
    { new: true, upsert: true }
  );

  return availability;
};

export const getAvailability = async (providerId) => {
  return await Availability.find({ provider: providerId });
};