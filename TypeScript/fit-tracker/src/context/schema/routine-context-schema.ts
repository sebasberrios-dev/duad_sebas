import { z } from "zod";
import { DailyWorkout, Exercise, Routine } from "../../types/interfaces";
import { fcmZoneSchema, WORKOUT_STATUSES } from "../../types/types";

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

const exerciseSchema: z.ZodType<Exercise> = z.object({
  id: z.number(),
  exerciseName: z.string(),
  durationMinutes: z.number(),
  details: categorySchema,
  status: z.enum(WORKOUT_STATUSES),
});

const dailyWorkoutSchema: z.ZodType<DailyWorkout> = z.object({
  day: z.array(z.enum(["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"])),
  exercises: z.array(exerciseSchema),
  comment: z.string().optional(),
});

export const routineStorageSchema: z.ZodType<Routine> = z.object({
  id: z.number(),
  routineName: z.string(),
  routineStartDate: z.string(),
  workouts: z.array(dailyWorkoutSchema),
});
