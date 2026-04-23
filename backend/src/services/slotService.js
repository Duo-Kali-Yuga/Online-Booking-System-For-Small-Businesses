import Provider from "../models/Provider.js"; // Import Provider instead of Availability
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

export const getAvailableSlots = async (providerId, date, serviceDuration) => {
  const dayOfWeek = dayjs(date).day();

  // 1. Fetch the Provider directly to get settings
  const provider = await Provider.findById(providerId);
  if (!provider || !provider.settings) return [];

  // 2. Find the specific day config in the nested array
  const dayConfig = provider.settings.operatingHours.find(d => d.dayOfWeek === dayOfWeek);
  
  if (!dayConfig || !dayConfig.isOpen) return [];

  const start = timeToMinutes(dayConfig.startTime);
  const end = timeToMinutes(dayConfig.endTime);
  const buffer = provider.settings.bufferTime || 0; // Get buffer from settings

  let slots = [];

  // 3. Generate slots with BUFFER logic
  // The loop increment is (duration + buffer) to create the "Shifted" effect
  for (let t = start; t + serviceDuration <= end; t += (serviceDuration + buffer)) {
    slots.push({
      start: minutesToTime(t),
      end: minutesToTime(t + serviceDuration),
    });
  }

  // 4. Filter Breaks (same logic as before)
  if (dayConfig.breaks && dayConfig.breaks.length > 0) {
    slots = slots.filter((slot) => {
      const sStart = timeToMinutes(slot.start);
      const sEnd = timeToMinutes(slot.end);
      return !dayConfig.breaks.some((b) => {
        const bStart = timeToMinutes(b.start);
        const bEnd = timeToMinutes(b.end);
        return sStart < bEnd && sEnd > bStart; // Overlap check
      });
    });
  }

  // 5. Filter Appointments (Same logic as before)
  const appointments = await Appointment.find({
    provider: providerId,
    date: dayjs(date).startOf('day').toDate(),
    status: { $ne: "cancelled" },
  });

  slots = slots.filter((slot) => {
    const sStart = timeToMinutes(slot.start);
    const sEnd = timeToMinutes(slot.end);
    return !appointments.some((appt) => {
      const aStart = timeToMinutes(appt.startTime);
      const aEnd = timeToMinutes(appt.endTime);
      return sStart < aEnd && sEnd > aStart;
    });
  });

  return slots;
};