import { Days, fcmZone, Level, Experience } from "./types";

interface Sets {
  reps: number;
  weightKg: number;
}

export interface Rest {
  category: "Descanso";
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
  userCommment?: string;
}

export type Category = Cardio | Strength | Flexibility | Rest;

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
  complete: boolean;
}

export interface DailyWorkout {
  day: Days[];
  exercises: Exercise[];
  comment?: string;
}

export interface Routine {
  id: number;
  routineName: string;
  routineStartDate: string;
  workouts: DailyWorkout[];
}

export interface Membership {
  id: number;
  plan: "Free" | "Premium";
  startDate: string;
  status: "active" | "inactive";
}

interface Person {
  id: number;
  name: string;
  age: number;
  email: string;
}

export interface User extends Person {
  role: "User";
  level: Level;
  bodyWeight: number;
  membership: Membership;
  routine: Routine;
}

export interface Client {
  id: number;
  clientName: string;
}

export interface Coach extends Person {
  role: "Coach";
  experience: Experience;
  clients: Client[];
}

export interface Admin extends Person {
  role: "Admin";
}

export type AppUser = User | Coach | Admin;
