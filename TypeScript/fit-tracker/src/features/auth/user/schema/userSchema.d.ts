import { z } from "zod";
export declare const membershipSchema: z.ZodObject<{
    plan: z.ZodEnum<{
        Free: "Free";
        Premium: "Premium";
    }>;
}, z.core.$strip>;
export declare const registerUserSchema: z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodEmail;
    bodyWeight: z.ZodNumber;
    level: z.ZodEnum<{
        Principiante: "Principiante";
        Intermedio: "Intermedio";
        Avanzado: "Avanzado";
    }>;
    membership: z.ZodObject<{
        plan: z.ZodEnum<{
            Free: "Free";
            Premium: "Premium";
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type registerUserFormData = z.infer<typeof registerUserSchema>;
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export type loginUserFormData = z.infer<typeof loginUserSchema>;
