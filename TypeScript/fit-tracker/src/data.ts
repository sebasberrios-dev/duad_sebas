import { isDate } from "util/types";
import { Routine, User } from "./interfaces";

export const fullBodyPlan: Routine = {
  name: "Full Body Plan",
  entries: [
    {
      day: ["Lunes"],
      exercise: {
        name: "Running",
        durationMinutes: 45,
        details: {
          category: "Cardio",
          distanceKm: 10,
          fcm: ["Moderada"],
        },
      },
    },
    {
      day: ["Lunes"],
      exercise: {
        name: "Back",
        durationMinutes: 112,
        details: {
          category: "Fuerza",
          sets: [
            {
              reps: 6,
              weightKg: 70,
            },
            {
              reps: 6,
              weightKg: 65,
            },
            {
              reps: 6,
              weightKg: 60,
            },
          ],
        },
      },
    },
    {
      day: ["Miercoles"],
      exercise: {
        name: "Squats",
        durationMinutes: 30,
        details: {
          category: "Fuerza",
          sets: [
            {
              reps: 8,
              weightKg: 80,
            },
            {
              reps: 8,
              weightKg: 75,
            },
          ],
        },
      },
    },
    {
      day: ["Miercoles"],
      exercise: {
        name: "Walk",
        durationMinutes: 60,
        details: {
          category: "Cardio",
          distanceKm: 7,
          fcm: ["Ligera"],
        },
      },
    },
    {
      day: ["Viernes"],
      exercise: {
        name: "Yoga",
        durationMinutes: 30,
        details: {
          category: "Flexibilidad",
          poses: 6,
        },
      },
    },
  ],
};

export const user: User = {
  name: "Sebastián Berríos Aguilera",
  age: 21,
  bodyWeight: 76,
  level: "Intermedio",
  membership: {
    plan: "Free",
    start_date: new Date(),
    status: "✅ Activo",
  },
  routine: fullBodyPlan,
};
