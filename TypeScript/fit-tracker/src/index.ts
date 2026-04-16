import { Routine, User } from "./interfaces";
import { Days } from "./types";

const fullBodyPlan: Routine = {
  name: "Full Body Plan",
  entries: [
    {
      day: ["Lunes"],
      exercise: {
        name: "Running",
        durationMinutes: 45,
        caloriesPerMinute: 10.4,
        distanceKm: 5.2,
      },
    },
    {
      day: ["Lunes"],
      exercise: {
        name: "Back",
        durationMinutes: 112,
        caloriesPerMinute: 5.4,
      },
    },
    {
      day: ["Miercoles"],
      exercise: {
        name: "Squats",
        durationMinutes: 30,
        caloriesPerMinute: 10,
      },
    },
    {
      day: ["Miercoles"],
      exercise: {
        name: "Boxing",
        durationMinutes: 60,
        caloriesPerMinute: 15,
      },
    },
    {
      day: ["Viernes"],
      exercise: {
        name: "Swimming",
        durationMinutes: 60,
        caloriesPerMinute: 12,
      },
    },
  ],
};

const user: User = {
  name: "Sebastián Berríos Aguilera",
  age: 21,
  level: "Intermedio",
  routine: fullBodyPlan,
};
function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(` ${minutes}min`);

  return parts.length > 0 ? parts.join("") : "0min";
}

function calculateRoutineCalories(routine: Routine): number {
  let totalCalories = 0;

  for (const entry of routine.entries) {
    const exercise = entry.exercise;
    if (!exercise) continue;

    totalCalories += calculateCalories(
      exercise.durationMinutes,
      exercise.caloriesPerMinute,
    );
  }

  return totalCalories;
}

function getUniqueDays(routine: Routine, days: Days[]): string[] {
  for (const day of routine.entries) {
    days.push(...day.day);
  }

  const uniqueDays: string[] = [...new Set(days)];

  return uniqueDays;
}

function calculateWeeklyAvgCalories(
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

function calculateCalories(duration: number, calPerMin: number): number {
  const calories = duration * calPerMin;
  return Number(calories.toFixed(0));
}

function calculatePace(duration: number, distance: number): number {
  const pace = duration / distance;
  return Number(pace.toFixed(2));
}

function printUserProfile(user: User): void {
  console.log("👤 Perfil de Usuario");
  console.log("=====================");
  console.log(`Nombre: ${user.name}`);
  console.log(`Edad: ${user.age}`);
  console.log(`Nivel: ${user.level}`);
}

function printWorkoutStats(routine: Routine, totalCalories: number): void {
  console.log(`📋 Rutina Semanal: ${routine.name}`);
  console.log("──────────────────────────────────");
  for (const entry of routine.entries) {
    const caloriesPerDay = calculateCalories(
      entry.exercise.durationMinutes,
      entry.exercise.caloriesPerMinute,
    );
    const paceStr = entry.exercise.distanceKm
      ? ` - ${calculatePace(entry.exercise.durationMinutes, entry.exercise.distanceKm)} min/km`
      : "";

    console.log(
      `${entry.day}:  ${entry.exercise.name} - ${formatDuration(entry.exercise.durationMinutes)}${paceStr} (${caloriesPerDay} cal)`,
    );
  }
  const { cal, uniqueDays } = calculateWeeklyAvgCalories(
    routine,
    totalCalories,
  );
  console.log("──────────────────────────────────");
  console.log(`Total semanal: ${totalCalories} calorías`);
  console.log(`Promedio por día: ${cal} (${uniqueDays} días entrenados)`);
  console.log("──────────────────────────────────");
}

const totalCalories: number = calculateRoutineCalories(fullBodyPlan);

printUserProfile(user);
printWorkoutStats(fullBodyPlan, totalCalories);
