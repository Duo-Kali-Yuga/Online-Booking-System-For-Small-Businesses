import Appointment from "../models/Appointment.js";

export const getClientDashboard = async (userId) => {
  const upcoming = await Appointment.find({
    client: userId,
    status: "confirmed",
  }).sort({ date: 1 });

  const past = await Appointment.find({
    client: userId,
    status: "completed",
  });

  return {
    upcoming,
    past,
  };
};