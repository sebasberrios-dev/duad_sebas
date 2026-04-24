import { z } from "zod";

// Register User
export const membershipSchema = z.object({
  plan: z.enum(["Free", "Premium"]),
});

export const registerUserSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  age: z.number().min(1).max(120),
  bodyWeight: z.number().positive("Debe ser positivo"),
  level: z.enum(["Principiante", "Intermedio", "Avanzado"]),
  membership: membershipSchema,
});

export type registerUserFormData = z.infer<typeof registerUserSchema>;

// Login User
export const loginUserSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
});

export type loginUserFormData = z.infer<typeof loginUserSchema>;
