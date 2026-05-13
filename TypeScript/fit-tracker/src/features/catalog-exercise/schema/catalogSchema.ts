import { z } from "zod";

export const catalogExerciseSchema = z
  .object({
    exerciseName: z.string().min(1, "El nombre es requerido"),
    category: z.enum(["Cardio", "Fuerza", "Flexibilidad"]),
    muscle: z.string().optional(),
    description: z.string().min(1, "La descripción es requerida"),
  })
  .superRefine((data, ctx) => {
    if (data.category === "Fuerza" && !data.muscle)
      ctx.addIssue({
        code: "custom",
        message: "El músculo es requerido para ejercicios de fuerza",
        path: ["muscle"],
      });
  });

export type CatalogExerciseFormData = z.infer<typeof catalogExerciseSchema>;
