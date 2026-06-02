import { z } from "zod";
import { Membership } from "../../types/interfaces";
export declare const userStorageSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
    role: z.ZodLiteral<"User">;
    level: z.ZodEnum<{
        Principiante: "Principiante";
        Intermedio: "Intermedio";
        Avanzado: "Avanzado";
    }>;
    bodyWeight: z.ZodNumber;
    membership: z.ZodType<Membership, unknown, z.core.$ZodTypeInternals<Membership, unknown>>;
    routineId: z.ZodNumber;
}, z.core.$strip>;
export declare const coachStorageSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
    role: z.ZodLiteral<"Coach">;
    experience: z.ZodEnum<{
        JUNIOR: string;
        INTERMEDIATE: string;
        SENIOR: string;
        EXPERT: string;
    }>;
    clients: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        clientName: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const adminStorageSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
    role: z.ZodLiteral<"Admin">;
}, z.core.$strip>;
export declare const appUserStorageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
    role: z.ZodLiteral<"User">;
    level: z.ZodEnum<{
        Principiante: "Principiante";
        Intermedio: "Intermedio";
        Avanzado: "Avanzado";
    }>;
    bodyWeight: z.ZodNumber;
    membership: z.ZodType<Membership, unknown, z.core.$ZodTypeInternals<Membership, unknown>>;
    routineId: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
    role: z.ZodLiteral<"Coach">;
    experience: z.ZodEnum<{
        JUNIOR: string;
        INTERMEDIATE: string;
        SENIOR: string;
        EXPERT: string;
    }>;
    clients: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        clientName: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    age: z.ZodNumber;
    email: z.ZodString;
    role: z.ZodLiteral<"Admin">;
}, z.core.$strip>], "role">;
