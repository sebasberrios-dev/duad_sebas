import { Days, FCM, Category, Level } from "./types";

interface Sets {
  reps: number;
  weightKg: number;
}
export interface Cardio {
  category: "Cardio";
  distanceKm: number;
  fcm: FCM[];
}

export interface Strength {
  category: "Fuerza";
  sets: Sets[];
}

export interface Flexibility {
  category: "Flexibilidad";
  poses: number;
}

export interface Exercise {
  name: string;
  durationMinutes: number;
  details: Category;
}

interface RoutineEntry {
  day: Days[];
  exercise: Exercise;
}

export interface Routine {
  name: string;
  entries: RoutineEntry[];
}

interface Membership {
  plan: "Free" | "Premium";
  start_date: Date;
  status: "✅ Activo" | "❌ Inactivo";
}

export interface User {
  name: string;
  age: number;
  bodyWeight: number;
  level: Level;
  membership: Membership;
  routine: Routine;
}
