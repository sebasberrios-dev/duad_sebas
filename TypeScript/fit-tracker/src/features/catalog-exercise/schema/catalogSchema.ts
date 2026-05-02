import { z } from "zod";

export const catalogExerciseSchema = z.object({
  exerciseName: z.string().min(1, "El nombre es requerido"),
  category: z.enum(["Cardio", "Fuerza", "Flexibilidad"]),
  description: z.string().min(1, "La descripción es requerida"),
});

export type CatalogExerciseFormData = z.infer<typeof catalogExerciseSchema>;
