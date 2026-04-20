import Availability from "../models/Availability.js";
import Appointment from "../models/Appointment.js";
import dayjs from "dayjs";

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
};

export const getAvailableSlots = async (
  providerId,
  date,
  serviceDuration
) => {
  const dayOfWeek = dayjs(date).day();

  const availability = await Availability.findOne({
    provider: providerId,
    dayOfWeek,
  });

  if (!availability) return [];

  const start = timeToMinutes(availability.startTime);
  const end = timeToMinutes(availability.endTime);

    let slots = [];

  for (let t = start; t + serviceDuration <= end; t += serviceDuration) {
    slots.push({
      start: minutesToTime(t),
      end: minutesToTime(t + serviceDuration),
    });
  }

  if (availability.breaks.length > 0) {
    slots = slots.filter((slot) => {
      const slotStart = timeToMinutes(slot.start);

      return !availability.breaks.some((b) => {
        const breakStart = timeToMinutes(b.start);
        const breakEnd = timeToMinutes(b.end);

        return slotStart >= breakStart && slotStart < breakEnd;
      });
    });
  }
  
  const appointments = await Appointment.find({
    provider: providerId,
    date: new Date(date),
    status: { $ne: "cancelled" },
  });

  slots = slots.filter((slot) => {
    return !appointments.some((appt) => {
      return appt.startTime === slot.start;
    });
  });

  return slots;
};