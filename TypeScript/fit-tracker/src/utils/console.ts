import { Routine, User } from "../types/interfaces";
import {
  calculatePace,
  formatDuration,
  formatDate,
  getTotalDuration,
  calculateAllCalories,
  calculateWeeklyAvgCalories,
  getUserInfo,
} from "../utils/utilities";

export function printUserInfo(user: User): void {
  const { name, age, bodyWeight, level } = user;
  const { plan, startDate, status } = user.membership;
  console.log("══════════════════════════════════");
  console.log(
    `👤 Usuario: ${name}, Edad: ${age}, Peso: ${bodyWeight} kg, Nivel: ${level}`,
  );
  console.log("──────────────────────────────────");
  console.log(`💎Membresía:`);
  console.log(
    `Plan: ${plan}, Fecha de inicio: ${formatDate(startDate)}, Estado: ${status === "active" ? "✅ Activa" : "❌ Inactiva"}`,
  );
  console.log("══════════════════════════════════\n");
}

export function printRoutine(routine: Routine, user: User): void {
  const { bodyWeight, level } = user;
  const { routineName, routineStartDate, workouts } = routine;
  const routineCalories = calculateAllCalories(routine, bodyWeight, level);

  printUserInfo(user);

  console.log(
    `📋 Rutina: ${routineName} | Inicio: ${formatDate(routineStartDate)}`,
  );
  console.log(" ────────────────────────────────────");

  for (const workout of workouts) {
    console.log(`${workout.day}:`);
    for (const exercise of workout.exercises) {
      const { exerciseName, durationMinutes, details, complete } = exercise;
      const { category } = details;
      const duration = formatDuration(durationMinutes);

      if (exerciseName === "Descanso") {
        console.log("(Descanso)");
      }

      if (category === "Cardio") {
        const exerciseCalories =
          routineCalories.perExercise.find(
            (e) => e.exerciseName === exerciseName,
          )?.calories ?? 0;
        const pace = calculatePace(durationMinutes, details.distanceKm);
        console.log(
          `${complete ? "✅" : "❌"}  ${exerciseName} [${category}], ${duration}, ${pace}min/km | ${exerciseCalories} kcal quemadas`,
        );
      }
      if (category === "Fuerza") {
        console.log(
          `${complete ? "✅" : "❌"}  ${exerciseName} [${category}], ${duration}`,
        );
        for (const [index, set] of details.sets.entries()) {
          console.log(
            ` - Serie ${index + 1} | ${set.reps} reps | ${set.weightKg} kg`,
          );
        }
      }
      if (category === "Flexibilidad") {
        console.log(
          `${complete ? "✅" : "❌"}  ${exerciseName} [${category}], ${duration}`,
        );
      }
    }
    console.log(`💬 "${workout.comment === undefined ? "" : workout.comment}"`);
    console.log(" ────────────────────────────────────");
  }
}

export function printWeeklyLoad(routine: Routine, user: User): void {
  const { bodyWeight, level } = user;
  const {
    total,
    formatTotalDuration,
    cardioDuration,
    strengthDuration,
    flexDuration,
  } = getTotalDuration(routine);
  const { totalCalories } = calculateAllCalories(routine, bodyWeight, level);
  const { cal, uniqueDays } = calculateWeeklyAvgCalories(
    routine,
    totalCalories,
  );

  console.log("📊 Carga semanal");
  console.log(
    `${formatTotalDuration} | ${totalCalories} kcal | Promedio: ${cal} kcal (${uniqueDays} días entrenados)`,
  );
  console.log(
    `🏃 Cardio: ${cardioDuration}   💪 Fuerza: ${strengthDuration}  🧘 Flexibilidad: ${flexDuration}`,
  );
  if (uniqueDays > 5 || total > 300) {
    console.log(
      "⚠️ Considera tener un día más de descanso o horas de entrenamiento esta semana.",
    );
  } else if (uniqueDays < 3 || total < 150) {
    console.log(
      "⚠️ Considera agregar un día más de entrenamiento esta semana.",
    );
  }
}

export function printClientsInfo(users: User[], userId: User["id"]) {
  const info = getUserInfo(users, userId);
  if (!info) return;
  const { name, level, bodyWeight, routine } = info;
  const { totalCalories } = calculateAllCalories(routine, bodyWeight, level);
  const { uniqueDays } = calculateWeeklyAvgCalories(routine, totalCalories);
  const { formatTotalDuration } = getTotalDuration(routine);
  console.log(`${name} (${level})`);
  console.log(`Rutina: ${routine.routineName}`);
  console.log(
    `Semana: ${uniqueDays} días | ${formatTotalDuration} | ${totalCalories} kcal`,
  );
}
