import * as appointmentService from "../services/appointmentServices.js";
import { rescheduleAppointment as rescheduleService } from "../services/rescheduleAppintment.js";
import { successResponse } from "../utils/response.js";
import Appointment from "../models/Appointment.js";
import Provider from "../models/Provider.js";

export const bookAppointment = async (req, res) => {
  const { rescheduleId, ...bookingData } = req.body;
  

  let targetClientId = req.user._id; 
  let dynamicStatus = 'pending';

  try {

    const activeProvider = await Provider.findOne({ user: req.user._id });


    if (rescheduleId) {
      const oldAppointment = await Appointment.findById(rescheduleId);
      if (!oldAppointment) {
        return res.status(404).json({ message: "Original appointment not found" });
      }
      
      // Preserve the true client identity regardless of who pressed the button
      targetClientId = oldAppointment.client;

      // Symmetrical logic: If a provider moves it, confirm it. If a client moves it, require verification.
      if (activeProvider) {
        dynamicStatus = 'confirmed';
      } else {
        dynamicStatus = 'pending';
      }
    }

    // Append our smart status logic directly onto the service payload parameters
    const preparedPayload = {
      ...bookingData,
      status: dynamicStatus
    };

    // 2. Instantiate the new appointment record matching the context profile
    const newAppointment = await appointmentService.createAppointment(
      targetClientId,
      preparedPayload
    );

    // 3. Mark the historical record state as cancelled and create the history link
    if (rescheduleId) {
      const oldAppointment = await Appointment.findById(rescheduleId)
        .populate("provider")  // <-- populate provider info
        .populate("client");   // optional, if you want client info
      if (!oldAppointment) {
        return res.status(404).json({ message: "Original appointment not found" });
      }

      targetClientId = oldAppointment.client._id;

      // If a provider is logged in, auto-confirm. If client, pending.
      if (activeProvider) {
        dynamicStatus = "confirmed";
      } else {
        dynamicStatus = "pending";
      }

      // oldApptData will now include provider info
      bookingData.provider = oldAppointment.provider._id;
    }

    return successResponse(res, newAppointment, "Appointment confirmed", 201);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
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
  console.log("Hello scheduler")
  try {
    const result = await rescheduleService(
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
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const appointments = await Appointment.find({ provider: provider._id })
      .populate("client", "name email")
      .populate("service", "name price duration")
      .sort({ date: 1, startTime: 1 });

    return res.json({ success: true, data: appointments }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, provider: provider._id }, 
      { status },
      { returnDocument: 'after' } 
    ).populate("client", "email name");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    try {
      if (appointment.client?.email) {
        await notifyStatusChange(appointment.client.email, {
          status,
          businessName: provider.businessName,
          date: appointment.date
        });
      }
    } catch (emailError) {
      console.error("Non-critical: Email notification failed:", emailError.message);
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getClientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ client: req.user._id })
      .populate({
        path: "provider", 
        select: "businessName location industry" 
      })
      .populate("service", "name price duration")
      .sort({ date: -1 });

    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error("DEBUG ERROR:", error); 
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Not found" });

    const provider = await Provider.findOne({ user: req.user._id });
    if (appointment.provider.toString() !== provider._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Appointment removed from records" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};