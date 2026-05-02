import { z } from "zod";

export const registerAdminSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  age: z.number().min(1).max(120),
  email: z.email(),
});

export type registerAdminFormData = z.infer<typeof registerAdminSchema>;

export const loginAdminSchema = z.object({
  email: z.email(),
});

export type loginAdminFormData = z.infer<typeof loginAdminSchema>;
