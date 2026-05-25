import { z } from "zod";
import { fcmZoneSchema, WORKOUT_STATUSES } from "../../../types/types";

// Entradas por ejercicio base
const exerciseBaseSchema = z.object({
  catalogExerciseId: z.number().positive(),
  exerciseName: z.string().min(1),
  durationMinutes: z.number().min(0, "La duración debe ser mayor a 0"),
  status: z.enum(WORKOUT_STATUSES).default("pending"),
});

// Cardio
const cardioSchema = z.object({
  distanceKm: z.number().positive(),
  fcm: fcmZoneSchema,
});
const cardioExerciseSchema = exerciseBaseSchema.extend({
  category: z.literal("Cardio"),
  details: cardioSchema,
});

// Fuerza
const setSchema = z.object({
  reps: z.number({ error: "Ingresa un número" }).min(1),
  weightKg: z.number({ error: "Ingresa un número" }),
});
const strengthSchema = z.object({
  sets: z.array(setSchema),
});
const strengthExerciseSchema = exerciseBaseSchema.extend({
  category: z.literal("Fuerza"),
  details: strengthSchema,
});

// Flexibilidad
const flexSchema = z.object({
  poses: z.number().positive(),
});
const flexExerciseSchema = exerciseBaseSchema.extend({
  category: z.literal("Flexibilidad"),
  details: flexSchema,
});

export const exerciseSchema = z.discriminatedUnion("category", [
  cardioExerciseSchema,
  strengthExerciseSchema,
  flexExerciseSchema,
]);

export type ExerciseFormData = z.infer<typeof exerciseSchema>;
