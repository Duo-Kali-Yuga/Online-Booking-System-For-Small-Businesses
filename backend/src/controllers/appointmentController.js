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
  let targetClientId = req.user._id; // Default: the logged-in user (Client)

  // 1. If it's a reschedule, we MUST find the original client
  if (rescheduleId) {
    const oldAppointment = await Appointment.findById(rescheduleId);
    if (!oldAppointment) {
      return res.status(404).json({ message: "Original appointment not found" });
    }
    // Set the target client to the person who owned the original appointment
    targetClientId = oldAppointment.client;
  }

  // 2. Create the new appointment using the correct Client ID
  try {
      const newAppointment = await appointmentService.createAppointment(
      targetClientId,
      bookingData
    );

    // 3. Handle the old record cleanup
    if (rescheduleId) {
      await Appointment.findByIdAndUpdate(rescheduleId, { 
        status: 'cancelled', 
        rescheduledTo: newAppointment._id 
      });
    }

    return successResponse(res, newAppointment, "Appointment confirmed", 201);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// export const bookAppointment = async (req, res) => {
//   const { rescheduleId, ...bookingData } = req.body;

//   // 1. Create the new appointment using your existing service
//   let newAppointment = ""

//   const providerReschedule = await Appointment.find({provider: req.body.providerId, client: req.user._id });

//   console.log("Dragon...:", providerReschedule)
//   console.log("Dragon...:User", req.user._id)

//   if(providerReschedule) {
//     console.log("step 1")
//     newAppointment = await appointmentService.createAppointment(
//       null,
//       bookingData
//     );
//   } else {
//     console.log("step 2")
//     newAppointment = await appointmentService.createAppointment(
//       req.user._id,
//       bookingData
//     );
//   }

//   // 2. If it's a reschedule, handle the old record
//   if (rescheduleId) {
//     try {
//       await Appointment.findOneAndUpdate(
//         { _id: rescheduleId, client: req.user._id },
//         { 
//           status: 'cancelled', 
//           // Optional: link them so you can track the history in your thesis
//           rescheduledTo: newAppointment._id 
//         }
//       );
//     } catch (error) {
//       // We log the error but don't fail the whole request 
//       // because the NEW appointment was already successfully created
//       console.error("Non-critical: Failed to cancel old appointment:", error);
//     }
//   }

//   return successResponse(res, newAppointment, "Appointment confirmed", 201);
// };


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

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, provider: provider._id }, 
      { status },
      { returnDocument: 'after' } 
    ).populate("client", "email name");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // CRITICAL: Wrap email in a try/catch so it doesn't break the whole app
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
      // We don't return res.error here because the DB update actually worked!
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error("Status Update Error:", error);
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

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Not found" });

    // Security check: Only the provider assigned to this appointment can delete it
    // Assuming req.user._id is the provider's User ID
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