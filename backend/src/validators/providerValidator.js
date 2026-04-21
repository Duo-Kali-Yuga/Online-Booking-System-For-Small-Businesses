import { z } from "zod";

export const providerSchema = z.object({
  businessName: z.string().min(2),
  industry: z.enum(["doctor", "barber", "salon", "consultant", "other"]),
  description: z.string().optional(),
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
  }),
});