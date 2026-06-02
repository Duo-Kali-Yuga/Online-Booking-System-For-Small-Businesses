import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import { createAppointment } from "./appointmentServices.js";
import Provider from "../models/Provider.js";

export const rescheduleAppointment = async (
  userId,
  appointmentId,
  { newDate, newStartTime }
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const appointment = await Appointment.findById(appointmentId).session(
      session
    );

    if (!appointment) throw new Error("Appointment not found");

    if (appointment.status === "cancelled")
      throw new Error("Cannot reschedule a cancelled appointment");

    const provider = await Provider.findOne({ user: userId });

    const isClient = appointment.client.toString() === userId.toString();
    const isProvider =
      provider && appointment.provider.toString() === provider._id.toString();

    if (!isClient && !isProvider)
      throw new Error("Not authorized");

    const newAppointment = await createAppointment(userId, {
      providerId: appointment.provider,
      serviceId: appointment.service,
      date: newDate,
      startTime: newStartTime,
    });

    appointment.status = "cancelled";
    await appointment.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      old: appointment,
      new: newAppointment,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};