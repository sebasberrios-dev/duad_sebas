import { z } from "zod";
export const registerRoutineSchema = z.object({
    routineName: z.string().min(2, "Mínimo 2 caracteres"),
    routineComment: z.string().optional(),
});
