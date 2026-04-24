import { Days, fcmZone, Level } from "./types";

interface Sets {
  reps: number;
  weightKg: number;
}

export interface Cardio {
  category: "Cardio";
  distanceKm: number;
  fcm: fcmZone;
}

export interface Strength {
  category: "Fuerza";
  sets: Sets[];
}

export interface Flexibility {
  category: "Flexibilidad";
  poses: number;
}

export type Category = Cardio | Strength | Flexibility;

export interface CatalogExercise {
  id: number;
  exerciseName: string;
  category: Category["category"];
  description: string;
}

export interface Exercise {
  id: number;
  exerciseName: string;
  durationMinutes: number;
  details: Category;
}

interface RoutineEntry {
  day: Days[];
  exercise: Exercise;
}

export interface Routine {
  id: number;
  routineName: string;
  entries: RoutineEntry[];
}

interface Membership {
  id: number;
  plan: "Free" | "Premium";
  start_date: Date;
  status: "✅ Activo" | "❌ Inactivo";
}

export interface User {
  id: number;
  name: string;
  age: number;
  bodyWeight: number;
  level: Level;
  membership: Membership;
  routine: Routine;
}
