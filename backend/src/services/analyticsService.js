import Appointment from "../models/Appointment.js";
import Provider from "../models/Provider.js";

export const getDashboardStats = async (userId) => {
  const provider = await Provider.findOne({ user: userId });
  if (!provider) throw new Error("Provider not found");

  const match = {
    provider: provider._id,
    status: "confirmed",
  };

  const totalAppointments = await Appointment.countDocuments(match);

  const revenueData = await Appointment.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceData",
      },
    },
    { $unwind: "$serviceData" },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$serviceData.price" },
      },
    },
  ]);

  const serviceStats = await Appointment.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$service",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return {
    totalAppointments,
    totalRevenue: revenueData[0]?.totalRevenue || 0,
    serviceStats,
  };
};