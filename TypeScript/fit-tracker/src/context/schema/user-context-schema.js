import { z } from "zod";
import { experienceSchema } from "../../types/types";
const membershipSchema = z.object({
    id: z.number(),
    plan: z.enum(["Free", "Premium"]),
    startDate: z.string(),
    status: z.enum(["active", "inactive"]),
});
export const userStorageSchema = z.object({
    id: z.number(),
    name: z.string(),
    age: z.number(),
    email: z.string(),
    role: z.literal("User"),
    level: z.enum(["Principiante", "Intermedio", "Avanzado"]),
    bodyWeight: z.number(),
    membership: membershipSchema,
    routineId: z.number(),
});
export const coachStorageSchema = z.object({
    id: z.number(),
    name: z.string(),
    age: z.number(),
    email: z.string(),
    role: z.literal("Coach"),
    experience: experienceSchema,
    clients: z.array(z.object({ id: z.number(), clientName: z.string() })),
});
export const adminStorageSchema = z.object({
    id: z.number(),
    name: z.string(),
    age: z.number(),
    email: z.string(),
    role: z.literal("Admin"),
});
export const appUserStorageSchema = z.discriminatedUnion("role", [
    userStorageSchema,
    coachStorageSchema,
    adminStorageSchema,
]);
