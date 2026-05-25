import { z } from "zod";
export declare const storedCatalogSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    exerciseName: z.ZodString;
    category: z.ZodOptional<z.ZodEnum<{
        Cardio: "Cardio";
        Fuerza: "Fuerza";
        Flexibilidad: "Flexibilidad";
    }>>;
    muscle: z.ZodOptional<z.ZodString>;
    description: z.ZodString;
    source: z.ZodEnum<{
        local: "local";
        api: "api";
    }>;
}, z.core.$strip>>;
