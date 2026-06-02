import { Routine, User } from "../types/interfaces";
import {
  calculatePace,
  formatDuration,
  formatDate,
  getTotalDuration,
  calculateAllCalories,
  calculateWeeklyAvgCalories,
} from "../utils/utilities";
import { CatalogReport } from "./types";

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
      const { exerciseName, durationMinutes, details, status } = exercise;
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
          `${status === "completed" ? "✅" : status === "skipped" ? "❌" : "⏳"}  ${exerciseName} [${category}], ${duration}, ${pace}min/km | ${exerciseCalories} kcal quemadas`,
        );
      }
      if (category === "Fuerza") {
        console.log(
          `${status === "completed" ? "✅" : status === "skipped" ? "❌" : "⏳"}  ${exerciseName} [${category}], ${duration}`,
        );
        for (const [index, set] of details.sets.entries()) {
          console.log(
            ` - Serie ${index + 1} | ${set.reps} reps | ${set.weightKg} kg`,
          );
        }
      }
      if (category === "Flexibilidad") {
        console.log(
          `${status === "completed" ? "✅" : status === "skipped" ? "❌" : "⏳"}  ${exerciseName} [${category}], ${duration}`,
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


export function printCatalogReport(
  report: CatalogReport,
  filter?: { kind: "muscle" | "type"; value: string },
): void {
  const filterLabel = filter ? `, ${filter.kind}: ${filter.value}` : "";

  console.log(`\n📊 Resultados de búsqueda${filterLabel}`);
  console.log(" ────────────────────────────────────");
  console.log(`✅ Agregados al catálogo (${report.totals.total})`);
  for (const group of report.byCategory) {
    for (const ex of group.exercises) {
      const name = ex.exerciseName.padEnd(16);
      const category = (ex.category ?? "").toLowerCase().padEnd(10);
      console.log(`    ${name}, ${category}| validado`);
    }
  }
  if (report.incomplete.length > 0) {
    console.log("");
    console.log(`⚠️ Datos incompletos (${report.incomplete.length})`);
    for (const ex of report.incomplete) {
      const name = (ex.exerciseName || "(sin nombre)").padEnd(16);
      console.log(`    ${name}, campos requeridos faltantes`);
    }
  }
  console.log("");
  console.log(
    `Catálogo local: ${report.totals.local} ejercicios | Desde API: ${report.totals.api} ejercicios`,
  );
  console.log("══════════════════════════════════\n");
}
