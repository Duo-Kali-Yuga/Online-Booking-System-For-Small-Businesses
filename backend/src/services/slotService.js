import Availability from "../models/Availability.js";
import Appointment from "../models/Appointment.js";
import Provider from "../models/Provider.js";
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

// export const getAvailableSlots = async (providerId, date, serviceDuration) => {
//   const dayOfWeek = dayjs(date).day();
  
//   const provider = await Provider.findById(providerId);
//   if (!provider) return [];

//   // Robust check for operatingHours
//   const hours = provider.settings?.operatingHours || [];
//   const dayConfig = hours.find(d => d.dayOfWeek === dayOfWeek);
  
//   if (!dayConfig) {
//     console.warn(`⚠️ Day ${dayOfWeek} is missing from Provider settings.`);
//     return []; 
//   }
  
//   if (!dayConfig.isOpen || !dayConfig.startTime || !dayConfig.endTime) {
//     return [];
//   }

//   // Ensure serviceDuration is a valid number > 0 to avoid infinite loops
//   const duration = Number(serviceDuration) || 30;

//   console.log(`Generating slots from ${dayConfig.startTime} to ${dayConfig.endTime}`);

//   const start = timeToMinutes(dayConfig.startTime);
//   const end = timeToMinutes(dayConfig.endTime);
//   const buffer = provider.settings.bufferTime || 0; // Get buffer from settings

//   let slots = [];

//   // 3. Generate slots with BUFFER logic
//   // The loop increment is (duration + buffer) to create the "Shifted" effect
//   for (let t = start; t + serviceDuration <= end; t += (serviceDuration + buffer)) {
//     slots.push({
//       start: minutesToTime(t),
//       end: minutesToTime(t + serviceDuration),
//     });
//   }

//   // 4. Filter Breaks (same logic as before)
//   if (dayConfig.breaks && dayConfig.breaks.length > 0) {
//     slots = slots.filter((slot) => {
//       const sStart = timeToMinutes(slot.start);
//       const sEnd = timeToMinutes(slot.end);
//       return !dayConfig.breaks.some((b) => {
//         const bStart = timeToMinutes(b.start);
//         const bEnd = timeToMinutes(b.end);
//         return sStart < bEnd && sEnd > bStart; // Overlap check
//       });
//     });
//   }

//   // 5. Filter Appointments (Same logic as before)
//   const appointments = await Appointment.find({
//     provider: providerId,
//     date: dayjs(date).startOf('day').toDate(),
//     status: { $ne: "cancelled" },
//   });

//   slots = slots.filter((slot) => {
//     const sStart = timeToMinutes(slot.start);
//     const sEnd = timeToMinutes(slot.end);
//     return !appointments.some((appt) => {
//       const aStart = timeToMinutes(appt.startTime);
//       const aEnd = timeToMinutes(appt.endTime);
//       return sStart < aEnd && sEnd > aStart;
//     });
//   });

//   return slots;
// };

export const getAvailableSlots = async (providerId, date, serviceDuration) => {
  const dayOfWeek = dayjs(date).day();

  // 1. Fetch from the Availabilities collection, NOT the Provider settings
  const dayConfig = await Availability.findOne({ 
    provider: providerId, 
    dayOfWeek: dayOfWeek 
  });

  // If no document exists for that day, the provider is closed
  if (!dayConfig) {
    console.log(`No availability document found for day ${dayOfWeek}`);
    return [];
  }

  // 2. Fetch provider just for the bufferTime
  const provider = await Provider.findById(providerId);
  const buffer = provider?.settings?.bufferTime || 0;

  const start = timeToMinutes(dayConfig.startTime);
  const end = timeToMinutes(dayConfig.endTime);

  let slots = [];

  // 3. Generate slots
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
        return sStart < bEnd && sEnd > bStart;
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