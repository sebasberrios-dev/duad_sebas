import { Tracing } from "node:trace_events";
import { Routine } from "./interfaces";
import {
  Days,
  FCM,
  FCM_TO_MET,
  Level,
  LEVEL_TO_MET_FLEXIBILITY,
  LEVEL_TO_MET_STRENGTH,
} from "./types";

function estimateCardioMet(fcmZones: FCM[]): number {
  const mets = fcmZones.map((zone) => FCM_TO_MET[zone]);
  return Math.max(...mets);
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

export function calculateCaloriesByCategory(
  routine: Routine,
  bodyWeight: number,
  level: Level,
): {
  cardioCalories: number;
  strengthCalories: number;
  flexCalories: number;
  perExercise: { name: string; calories: number }[];
} {
  let cardioCalories = 0;
  let strengthCalories = 0;
  let flexCalories = 0;
  const perExercise: { name: string; calories: number }[] = [];

  for (const entry of routine.entries) {
    const { name, details, durationMinutes } = entry.exercise;
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

    perExercise.push({ name, calories });

    if (details.category === "Cardio") {
      cardioCalories += calories;
    } else if (details.category === "Fuerza") {
      strengthCalories += calories;
    } else {
      flexCalories += calories;
    }
  }

  return { cardioCalories, strengthCalories, flexCalories, perExercise };
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

export function formatDate(date: Date): string {
  return `${date.toLocaleDateString()}`;
}

function getUniqueDays(routine: Routine, days: Days[]): string[] {
  for (const day of routine.entries) {
    days.push(...day.day);
  }

  const uniqueDays: string[] = [...new Set(days)];

  return uniqueDays;
}

export function getTotalExercises(routine: Routine): number {
  return routine.entries.length;
}

export function getTotalExercisesByCategory(routine: Routine): {
  totalCardio: number;
  totalStrength: number;
  totalFlex: number;
} {
  let totalCardio: number = 0;
  let totalStrength: number = 0;
  let totalFlex: number = 0;

  for (const entry of routine.entries) {
    const { category } = entry.exercise.details;
    if (category === "Cardio") {
      totalCardio += 1;
    } else if (category === "Fuerza") {
      totalStrength += 1;
    } else {
      totalFlex += 1;
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
} {
  let totalCardio = 0;
  let totalStrength = 0;
  let totalFlex = 0;

  for (const entry of routine.entries) {
    const { category } = entry.exercise.details;
    const duration = entry.exercise.durationMinutes;

    if (category === "Cardio") {
      totalCardio += duration;
    } else if (category === "Fuerza") {
      totalStrength += duration;
    } else {
      totalFlex += duration;
    }
  }

  const cardioDuration = formatDuration(totalCardio);
  const strengthDuration = formatDuration(totalStrength);
  const flexDuration = formatDuration(totalFlex);

  return { cardioDuration, strengthDuration, flexDuration };
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
