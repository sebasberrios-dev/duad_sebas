import { Routine, User } from "../types/interfaces";
import {
  Days,
  fcmZone,
  FCM_TO_MET,
  Level,
  LEVEL_TO_MET_FLEXIBILITY,
  LEVEL_TO_MET_STRENGTH,
} from "../types/types";

function estimateCardioMet(zone: fcmZone): number {
  return FCM_TO_MET[zone];
}

function estimateStrengthMet(level: Level): number {
  return LEVEL_TO_MET_STRENGTH[level];
}

function estimateFlexMet(level: Level): number {
  return LEVEL_TO_MET_FLEXIBILITY[level];
}

function calculateCaloriesPerMinute(met: number, bodyWeight: number): number {
  return (met * bodyWeight) / 60;
}

export function calculateCalories(duration: number, calPerMin: number): number {
  const calories = duration * calPerMin;
  return Number(calories.toFixed(0));
}

export function calculateAllCalories(
  routine: Routine,
  bodyWeight: number,
  level: Level,
): {
  cardioCalories: number;
  strengthCalories: number;
  flexCalories: number;
  perExercise: { exerciseName: string; calories: number }[];
  totalCalories: number;
} {
  let cardioCalories = 0;
  let strengthCalories = 0;
  let flexCalories = 0;
  const perExercise: { exerciseName: string; calories: number }[] = [];

  for (const entry of routine.workouts) {
    for (const exercise of entry.exercises) {
      const { exerciseName, details, durationMinutes } = exercise;
      let met: number;

      if (details.category === "Cardio") {
        met = estimateCardioMet(details.fcm);
      } else if (details.category === "Fuerza") {
        met = estimateStrengthMet(level);
      } else {
        met = estimateFlexMet(level);
      }

      const calPerMin = calculateCaloriesPerMinute(met, bodyWeight);
      const calories = calculateCalories(durationMinutes, calPerMin);

      perExercise.push({ exerciseName, calories });

      if (details.category === "Cardio") {
        cardioCalories += calories;
      } else if (details.category === "Fuerza") {
        strengthCalories += calories;
      } else {
        flexCalories += calories;
      }
    }
  }
  const totalCalories = cardioCalories + strengthCalories + flexCalories;
  return {
    cardioCalories,
    strengthCalories,
    flexCalories,
    perExercise,
    totalCalories,
  };
}

export function calculatePace(duration: number, distance: number): number {
  const pace = duration / distance;
  return Number(pace.toFixed(2));
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(` ${minutes} min`);

  return parts.length > 0 ? parts.join("") : "0 min";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

function getUniqueDays(routine: Routine, days: Days[]): string[] {
  for (const day of routine.workouts) {
    days.push(...day.day);
  }

  const uniqueDays: string[] = [...new Set(days)];

  return uniqueDays;
}

export function getTotalExercises(routine: Routine): number {
  return routine.workouts.length;
}

export function getTotalExercisesByCategory(routine: Routine): {
  totalCardio: number;
  totalStrength: number;
  totalFlex: number;
} {
  let totalCardio: number = 0;
  let totalStrength: number = 0;
  let totalFlex: number = 0;

  for (const entry of routine.workouts) {
    for (const exercise of entry.exercises) {
      const { category } = exercise.details;
      if (category === "Cardio") {
        totalCardio += 1;
      } else if (category === "Fuerza") {
        totalStrength += 1;
      } else {
        totalFlex += 1;
      }
    }
  }

  return {
    totalCardio,
    totalStrength,
    totalFlex,
  };
}

export function getTotalDuration(routine: Routine): {
  cardioDuration: string;
  strengthDuration: string;
  flexDuration: string;
  total: number;
  formatTotalDuration: string;
} {
  let totalCardio = 0;
  let totalStrength = 0;
  let totalFlex = 0;

  for (const entry of routine.workouts) {
    for (const exercise of entry.exercises) {
      const { category } = exercise.details;
      const duration = exercise.durationMinutes;

      if (category === "Cardio") {
        totalCardio += duration;
      } else if (category === "Fuerza") {
        totalStrength += duration;
      } else {
        totalFlex += duration;
      }
    }
  }
  const total = totalCardio + totalStrength + totalFlex;

  const cardioDuration = formatDuration(totalCardio);
  const strengthDuration = formatDuration(totalStrength);
  const flexDuration = formatDuration(totalFlex);
  const formatTotalDuration = formatDuration(total);

  return {
    cardioDuration,
    strengthDuration,
    flexDuration,
    total,
    formatTotalDuration,
  };
}

export function calculateWeeklyAvgCalories(
  routine: Routine,
  totalCalories: number,
): { cal: number; uniqueDays: number } {
  const days: Days[] = [];

  const uniqueDays: string[] = getUniqueDays(routine, days);
  const result =
    uniqueDays.length === 0 ? 0 : totalCalories / uniqueDays.length;

  return {
    cal: Number(result.toFixed(0)),
    uniqueDays: uniqueDays.length,
  };
}

export function genUniqueId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

export function getUserInfo(
  users: User[],
  userId: User["id"],
):
  | {
      name: string;
      level: string;
      bodyWeight: number;
      routine: Routine;
    }
  | undefined {
  const user = users.find((u) => u.id === userId);
  if (!user) return undefined;
  return {
    name: user.name,
    level: user.level,
    bodyWeight: user.bodyWeight,
    routine: user.routine,
  };
}
