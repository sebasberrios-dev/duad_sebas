import { z } from "zod";
export declare const catalogExerciseSchema: z.ZodObject<{
    exerciseName: z.ZodString;
    category: z.ZodEnum<{
        Cardio: "Cardio";
        Fuerza: "Fuerza";
        Flexibilidad: "Flexibilidad";
    }>;
    muscle: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
}, z.core.$strip>;
export type CatalogExerciseFormData = z.infer<typeof catalogExerciseSchema>;
