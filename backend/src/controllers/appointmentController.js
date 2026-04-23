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

// export const bookAppointment = async (req, res) => {
//   const appointment = await appointmentService.createAppointment(
//     req.user._id,
//     req.body
//   );

//   return successResponse(res, appointment, "Appointment booked", 201);
// };
// export const bookAppointment = async (req, res) => {
//   const appointment = await appointmentService.createAppointment(
//     req.user._id,
//     req.body
//   );

//   return res.status(201).json({
//     success: true,
//     message: "Appointment booked",
//     data: appointment,
//   });

// };

export const bookAppointment = async (req, res) => {
  const { rescheduleId, ...bookingData } = req.body;

  // 1. Create the new appointment using your existing service
  const newAppointment = await appointmentService.createAppointment(
    req.user._id,
    bookingData
  );

  // 2. If it's a reschedule, handle the old record
  if (rescheduleId) {
    try {
      await Appointment.findOneAndUpdate(
        { _id: rescheduleId, client: req.user._id },
        { 
          status: 'cancelled', 
          // Optional: link them so you can track the history in your thesis
          rescheduledTo: newAppointment._id 
        }
      );
    } catch (error) {
      // We log the error but don't fail the whole request 
      // because the NEW appointment was already successfully created
      console.error("Non-critical: Failed to cancel old appointment:", error);
    }
  }

  return successResponse(res, newAppointment, "Appointment confirmed", 201);
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

// Inside appointmentController.js
export const getProviderAppointments = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const appointments = await Appointment.find({ provider: provider._id })
      .populate("client", "name email")
      .populate("service", "name price duration")
      .sort({ date: 1, startTime: 1 });

    // Use successResponse if you have it imported, or keep res.json
    return res.json({ success: true, data: appointments }); 
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