interface Exercise {
  name: string;
  durationMinutes: number;
  caloriesPerMinute: number;
  distanceKm?: number;
  completed: boolean;
}

interface RoutineEntry {
  day: string;
  exercise: Exercise;
}

export interface Routine {
  name: string;
  entries: RoutineEntry[];
}

export interface User {
  name: string;
  age: number;
  level: string;
  routine: Routine;
}
