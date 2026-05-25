import { z } from "zod";
export const storedCatalogSchema = z.array(z.object({
    id: z.number(),
    exerciseName: z.string(),
    category: z.enum(["Cardio", "Fuerza", "Flexibilidad"]).optional(),
    muscle: z.string().optional(),
    description: z.string(),
    source: z.enum(["local", "api"]),
}));
