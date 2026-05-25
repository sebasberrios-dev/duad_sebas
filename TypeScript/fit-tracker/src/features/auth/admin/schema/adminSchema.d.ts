import { z } from "zod";
export declare const registerAdminSchema: z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodEmail;
}, z.core.$strip>;
export type registerAdminFormData = z.infer<typeof registerAdminSchema>;
export declare const loginAdminSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export type loginAdminFormData = z.infer<typeof loginAdminSchema>;
