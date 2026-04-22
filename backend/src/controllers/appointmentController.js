import * as appointmentService from "../services/appointmentServices.js";
import { successResponse } from "../utils/response.js";
import Appointment from "../models/Appointment.js";
import Provider from "../models/Provider.js";

// export const bookAppointment = async (req, res) => {
//   try {
//     const appointment = await appointmentService.createAppointment(
//       req.user._id,
//       req.body
//     );

//     res.status(201).json(appointment);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const bookAppointment = async (req, res) => {
  const appointment = await appointmentService.createAppointment(
    req.user._id,
    req.body
  );

  return successResponse(res, appointment, "Appointment booked", 201);
};


export const cancelAppointment = async (req, res) => {
  try {
    const result = await appointmentService.cancelAppointment(
      req.user._id,
      req.params.id
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const rescheduleAppointment = async (req, res) => {
  try {
    const result = await appointmentService.rescheduleAppointment(
      req.user._id,
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProviderAppointments = async (req, res) => {
  console.log("Searching for Provider profile linked to User ID:", req.user._id);

  try {
    const provider = await Provider.findOne({ user: req.user._id });
    
    if (!provider) {
      console.log("❌ No provider profile found in the 'providers' collection for this user.");
      return res.status(404).json({ 
        success: false, 
        message: "Provider profile not found. Please complete your profile setup." 
      });
    }

    console.log("✅ Provider found:", provider.businessName);

    const appointments = await Appointment.find({ provider: provider._id })
      .populate("client", "name email")
      .populate("service", "name price duration")
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Find the provider profile linked to the logged-in USER
    const provider = await Provider.findOne({ user: req.user._id });
    
    if (!provider) {
      return res.status(404).json({ message: "Provider profile not found" });
    }

    // 2. Update using the provider's ID (Security: Must be the owner)
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, provider: provider._id }, 
      { status },
      { new: true }
    ).populate("client", "email name");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // 3. Email Notification
    await notifyStatusChange(appointment.client.email, {
      status,
      businessName: provider.businessName,
      date: appointment.date
    });

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClientAppointments = async (req, res) => {
  try {
    // 1. Find appointments where this user is the client
    const appointments = await Appointment.find({ client: req.user._id })
      .populate({
        path: "provider", 
        // If "provider" in your Appointment model points to the "Provider" model:
        select: "businessName location industry" 
      })
      .populate("service", "name price duration")
      .sort({ date: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error("DEBUG ERROR:", error); // This shows exactly what failed
    res.status(500).json({ success: false, error: error.message });
  }
};