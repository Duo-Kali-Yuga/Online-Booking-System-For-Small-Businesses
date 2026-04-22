import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import Provider from "../models/Provider.js";
import { getAvailableSlots } from "./slotService.js";
import { sendEmail } from "../utils/email.js";
import User from "../models/User.js";
import dayjs from "dayjs"



export const createAppointment = async (
  userId,
  { providerId, serviceId, date, startTime }
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const service = await Service.findById(serviceId);
    if (!service) throw new Error("Service not found");

    
    const provider = await Provider.findById(providerId);
    if (!provider) throw new Error("Provider not found");

    
    const duration = service.duration;

    const [h, m] = startTime.split(":").map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + duration;

    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    
    const slots = await getAvailableSlots(providerId, date, duration);

    const isValid = slots.some((s) => s.start === startTime);
    if (!isValid) throw new Error("Slot no longer available");

    
    const appointment = await Appointment.create(
      [
        {
          client: userId,
          provider: providerId,
          service: serviceId,
          date: dayjs(date).startOf('day').toDate(),
          startTime,
          endTime,
          status: "confirmed",
        },
      ],
      { session }
    );

    const client = await User.findById(userId);

    await sendEmail({
      to: client.email,
      subject: "Appointment Confirmed",
      text: `Your appointment is confirmed for ${date} at ${startTime}`,
    });

    await session.commitTransaction();

    await notifyBookingSuccess(req.user.email, {
      date: newAppointment.date,
      startTime: newAppointment.startTime,
      businessName: provider.businessName
    });
    session.endSession();

    return appointment[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.code === 11000) {
      throw new Error("Slot already booked");
    }

    throw error;
  }
};

export const cancelAppointment = async (userId, appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) throw new Error("Appointment not found");

  if (appointment.status === "cancelled")
    throw new Error("Appointment already cancelled");

  
  const provider = await Provider.findOne({ user: userId });

  const isClient = appointment.client.toString() === userId.toString();
  const isProvider =
    provider && appointment.provider.toString() === provider._id.toString();

  if (!isClient && !isProvider)
    throw new Error("Not authorized to cancel this appointment");

  if (new Date(appointment.date) < new Date())
    throw new Error("Cannot cancel past appointments");

  appointment.status = "cancelled";
  await appointment.save();

  return appointment;
};