import { Routine, User } from "./interfaces";

const fullBodyPlan: Routine = {
  name: "Full Body Plan",
  entries: [
    {
      day: "Lunes",
      exercise: {
        name: "Running",
        durationMinutes: 45,
        caloriesPerMinute: 10.4,
        distanceKm: 5.2,
        completed: true,
      },
    },
    {
      day: "Miercoles",
      exercise: {
        name: "Squats",
        durationMinutes: 30,
        caloriesPerMinute: 10,
        completed: true,
      },
    },
    {
      day: "Viernes",
      exercise: {
        name: "Swimming",
        durationMinutes: 60,
        caloriesPerMinute: 12,
        completed: false,
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

function calculateRoutineCalories(routine: Routine): number {
  let totalCalories = 0;

  for (const entry of routine.entries) {
    totalCalories +=
      entry.exercise.durationMinutes * entry.exercise.caloriesPerMinute;
  }

  return totalCalories;
}

function printUserProfile(user: User): void {
  console.log("👤 Perfil de Usuario");
  console.log("=====================");
  console.log(`Nombre: ${user.name}`);
  console.log(`Edad: ${user.age}`);
  console.log(`Nivel: ${user.level}`);
}

function calculateCalories(duration: number, calPerMin: number): number {
  return duration * calPerMin;
}

function calculatePace(duration: number, distance: number): number {
  const pace = duration / distance;
  return Number(pace.toFixed(2));
}

function printWorkoutStats(routine: Routine, totalCalories: number): void {
  console.log(`📋 Rutina Semanal: ${routine.name}`);
  console.log("──────────────────────────────────");
  for (const entry of routine.entries) {
    const caloriesPerDay = calculateCalories(
      entry.exercise.durationMinutes,
      entry.exercise.caloriesPerMinute,
    );
    const isRace: boolean = !!entry.exercise.distanceKm;

    console.log(
      `${entry.day}:    ${entry.exercise.name} - ${entry.exercise.durationMinutes} min - ${isRace ? `${calculatePace(entry.exercise.durationMinutes, entry.exercise.distanceKm!)} min/km` : ""} (${caloriesPerDay} cal) ${entry.exercise.completed ? "✅¡Completado!" : "❌¡No completado!"}`,
    );
  }
  console.log("──────────────────────────────────");
  console.log(`Total semanal: ${totalCalories} calorías`);
  console.log("──────────────────────────────────");
}

const totalCalories: number = calculateRoutineCalories(fullBodyPlan);

printUserProfile(user);
printWorkoutStats(fullBodyPlan, totalCalories);
