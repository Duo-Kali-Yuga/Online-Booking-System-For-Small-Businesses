import * as appointmentService from "../services/appointmentService.js";
import { successResponse } from "../utils/response.js";

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