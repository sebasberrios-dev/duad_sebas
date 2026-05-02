import { z } from "zod";
import { experienceSchema } from "../../../../types/types";

export const registerCoachSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  age: z.number().min(1).max(120),
  email: z.email(),
  experience: experienceSchema,
});

export type registerCoachFormData = z.infer<typeof registerCoachSchema>;

export const loginCoachSchema = z.object({
  email: z.email(),
});

export type loginCoachFormData = z.infer<typeof loginCoachSchema>;
