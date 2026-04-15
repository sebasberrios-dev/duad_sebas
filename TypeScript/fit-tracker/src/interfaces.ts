import { Days } from "./types";
import { Level } from "./types";

interface Exercise {
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  distanceKm?: number;
}

interface RoutineEntry {
  day: Days[];
  exercise: Exercise;
}

export interface Routine {
  name: string;
  entries: RoutineEntry[];
}

export interface User {
  name: string;
  age: number;
  level: Level;
  routine: Routine;
}
