import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2),
  duration: z.number().min(1),
  price: z.number().min(0),
});