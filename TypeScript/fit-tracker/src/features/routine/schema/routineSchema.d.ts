import { z } from "zod";
export declare const registerRoutineSchema: z.ZodObject<{
    routineName: z.ZodString;
    routineComment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RegisterRoutineFormData = z.infer<typeof registerRoutineSchema>;
