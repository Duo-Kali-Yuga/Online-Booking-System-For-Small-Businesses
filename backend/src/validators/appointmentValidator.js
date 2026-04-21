import { z } from "zod";

export const createAppointmentSchema = z.object({
  providerId: z.string(),
  serviceId: z.string(),
  date: z.string(), // ISO format
  startTime: z.string(), // "HH:mm"
});

export const rescheduleSchema = z.object({
  newDate: z.string(),
  newStartTime: z.string(),
});