import { z } from "zod";
export declare const assignCoachSchema: z.ZodObject<{
    clientId: z.ZodNumber;
    coachId: z.ZodNumber;
}, z.core.$strip>;
export type assignCoachFormData = z.infer<typeof assignCoachSchema>;
