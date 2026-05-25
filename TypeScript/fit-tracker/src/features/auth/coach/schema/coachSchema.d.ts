import { z } from "zod";
export declare const registerCoachSchema: z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodEmail;
    experience: z.ZodEnum<{
        JUNIOR: string;
        INTERMEDIATE: string;
        SENIOR: string;
        EXPERT: string;
    }>;
}, z.core.$strip>;
export type registerCoachFormData = z.infer<typeof registerCoachSchema>;
export declare const loginCoachSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export type loginCoachFormData = z.infer<typeof loginCoachSchema>;
