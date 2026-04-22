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
    // 1. Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. If the user is a provider, clean up their business data
    if (user.role === 'provider') {
      await Provider.findOneAndDelete({ user: id });
      // Delete all appointments associated with this business
      await Appointment.deleteMany({ provider: id });
    }

    // 3. If the user is a client, clean up their bookings and reviews
    if (user.role === 'client') {
      await Appointment.deleteMany({ client: id });
      await Review.deleteMany({ client: id });
    }

    // 4. Finally, delete the core User account
    await User.findByIdAndDelete(id);

    res.json({ 
      success: true, 
      message: `User ${user.name} and all associated data have been purged.` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error during cascading deletion" 
    });
  }
};