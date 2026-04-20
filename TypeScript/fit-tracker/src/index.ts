import { Routine, User } from "./interfaces";
import {
  calculatePace,
  calculateWeeklyAvgCalories,
  formatDuration,
  formatDate,
  getTotalExercises,
  getTotalExercisesByCategory,
  getTotalDuration,
  calculateCaloriesByCategory,
} from "./utilities";
import { fullBodyPlan, user } from "./data";

function printUserInfo(user: User): void {
  console.log("══════════════════════════════════");
  console.log(
    `👤 Usuario: ${user.name}, Edad: ${user.age}, Peso: ${user.bodyWeight} kg, Nivel: ${user.level}`,
  );
  console.log("──────────────────────────────────");
  console.log(`💎Membresía:`);
  console.log(
    `Plan: ${user.membership.plan}, Fecha de inicio: ${formatDate(user.membership.start_date)}, Estado: ${user.membership.status}`,
  );
  console.log("══════════════════════════════════\n");
}

function printWorkoutStats(routine: Routine, user: User): void {
  const { bodyWeight, level } = user;
  const { totalCardio, totalStrength, totalFlex } =
    getTotalExercisesByCategory(routine);
  const { cardioDuration, strengthDuration, flexDuration } =
    getTotalDuration(routine);
  const { cardioCalories, strengthCalories, flexCalories } =
    calculateCaloriesByCategory(routine, bodyWeight, level);
  const { perExercise } = calculateCaloriesByCategory(
    routine,
    bodyWeight,
    level,
  );

  console.log("📊 Catálogo de Ejercicios ══════════════════════════════════");

  // Cardio
  console.log(
    `🏃 Cardio (${totalCardio} ejercicios, ${cardioDuration}, ${cardioCalories} kcal)`,
  );
  for (const entry of routine.entries) {
    const { name, details, durationMinutes } = entry.exercise;
    if (details.category !== "Cardio") continue;
    const calories = perExercise.find((e) => e.name === name)?.calories;
    const pace = calculatePace(durationMinutes, details.distanceKm);
    console.log(
      ` ${name}, ${formatDuration(durationMinutes)} | ${details.distanceKm} km | Ritmo: ${pace} min/km | ${calories} kcal`,
    );
  }
  console.log("\n──────────────────────────────────\n");

  // Fuerza
  console.log(
    `💪 Fuerza (${totalStrength} ejercicios, ${strengthDuration}, ${strengthCalories} kcal)`,
  );
  for (const entry of routine.entries) {
    const { name, details, durationMinutes } = entry.exercise;
    if (details.category !== "Fuerza") continue;
    const calories = perExercise.find((e) => e.name === name)?.calories;
    console.log(
      ` ${name}, ${details.sets.length} series | ${formatDuration(durationMinutes)} | ${calories} kcal`,
    );
    for (const [index, set] of details.sets.entries()) {
      console.log(
        `   Serie ${index + 1}: ${set.reps} reps | ${set.weightKg} kg`,
      );
    }
  }
  console.log("\n──────────────────────────────────\n");

  // Flexibilidad
  console.log(
    `🧘 Flexibilidad (${totalFlex} ejercicios, ${flexDuration}, ${flexCalories} kcal)`,
  );
  for (const entry of routine.entries) {
    const { name, details, durationMinutes } = entry.exercise;
    if (details.category !== "Flexibilidad") continue;
    const calories = perExercise.find((e) => e.name === name)?.calories;
    console.log(
      ` ${name}, ${details.poses} poses | ${formatDuration(durationMinutes)} | ${calories} kcal`,
    );
  }
  console.log("\n──────────────────────────────────\n");
  console.log(`Total: ${getTotalExercises(routine)} ejercicios`);
}

printUserInfo(user);
printWorkoutStats(fullBodyPlan, user);
