import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Appointment from "../models/Appointment.js";
import Review from "../models/Review.js";

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


export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 'provider') {
      // 1. Find the actual Provider profile first
      const providerProfile = await Provider.findOne({ user: id });
      
      if (providerProfile) {
        // 2. Delete appointments using the PROVIDER ID, not the USER ID
        await Appointment.deleteMany({ provider: providerProfile._id });
        await Provider.findByIdAndDelete(providerProfile._id);
      }
    }

    if (user.role === 'client') {
      await Appointment.deleteMany({ client: id });
      await Review.deleteMany({ client: id });
    }

    await User.findByIdAndDelete(id);

    return res.json({ success: true, message: "User and all data purged." });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  const [userCount, providerCount, appointmentCount] = await Promise.all([
    User.countDocuments({ role: 'client' }),
    Provider.countDocuments(),
    Appointment.countDocuments()
  ]);
  
  res.json({ 
    success: true, 
    data: { userCount, providerCount, appointmentCount } 
  });
};