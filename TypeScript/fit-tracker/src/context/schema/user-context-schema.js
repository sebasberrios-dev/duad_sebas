import { z } from "zod";
import { fcmZoneSchema, experienceSchema, WORKOUT_STATUSES } from "../../types/types";
const membershipSchema = z.object({
    id: z.number(),
    plan: z.enum(["Free", "Premium"]),
    startDate: z.string(),
    status: z.enum(["active", "inactive"]),
});
const categorySchema = z.discriminatedUnion("category", [
    z.object({
        category: z.literal("Cardio"),
        distanceKm: z.number(),
        fcm: fcmZoneSchema,
    }),
    z.object({
        category: z.literal("Fuerza"),
        sets: z.array(z.object({ reps: z.number(), weightKg: z.number() })),
    }),
    z.object({ category: z.literal("Flexibilidad"), poses: z.number() }),
    z.object({ category: z.literal("Descanso") }),
]);
const exerciseStorageSchema = z.object({
    id: z.number(),
    exerciseName: z.string(),
    durationMinutes: z.number(),
    details: categorySchema,
    status: z.enum(WORKOUT_STATUSES),
});
const dailyWorkoutSchema = z.object({
    day: z.array(z.enum(["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"])),
    exercises: z.array(exerciseStorageSchema),
    comment: z.string().optional(),
});
const routineStorageSchema = z.object({
    id: z.number(),
    routineName: z.string(),
    routineStartDate: z.string(),
    workouts: z.array(dailyWorkoutSchema),
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
    routine: routineStorageSchema,
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
