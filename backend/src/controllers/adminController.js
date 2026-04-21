import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Appointment from "../models/Appointment.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
};

export const getAllProviders = async (req, res) => {
  const providers = await Provider.find();
  res.json({ success: true, data: providers });
};

export const toggleProviderStatus = async (req, res) => {
  const provider = await Provider.findById(req.params.id);

  provider.active = !provider.active;
  await provider.save();

  res.json({ success: true, data: provider });
};

export const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find()
    .populate("client", "name email")
    .populate("provider", "businessName");

  res.json({ success: true, data: appointments });
};