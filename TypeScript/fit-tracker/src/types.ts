import { Cardio, Flexibility, Strength } from "./interfaces";

const Days = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miercoles",
  thursday: "Jueves",
  friday: "Viernes",
} as const;

const FCM = {
  zone1: "Muy ligera",
  zone2: "Ligera",
  zone3: "Moderada",
  zone4: "Intensa",
  zone5: "Máxima",
} as const;

const MET_CARDIO = {
  veryLight: 3.5,
  light: 4,
  moderate: 7,
  intense: 11,
  max: 13,
} as const;

export const LEVEL_TO_MET_STRENGTH: Record<Level, MET_STRENGTH> = {
  Principiante: 3.5,
  Intermedio: 5.0,
  Avanzado: 6.0,
};

export const LEVEL_TO_MET_FLEXIBILITY: Record<Level, MET_FLEXIBILITY> = {
  Principiante: 2.3,
  Intermedio: 2.5,
  Avanzado: 3.0,
};

export const FCM_TO_MET: Record<FCM, MET_CARDIO> = {
  "Muy ligera": 3.5,
  Ligera: 4,
  Moderada: 7,
  Intensa: 11,
  Máxima: 13,
};

const MET_STRENGTH = {
  light: 3.5,
  moderate: 5.0,
  intense: 6.0,
} as const;

const MET_FLEXIBILITY = {
  light: 2.3,
  moderate: 2.5,
  intense: 3.0,
} as const;

export type Days = (typeof Days)[keyof typeof Days];
export type Level = "Principiante" | "Intermedio" | "Avanzado";
export type FCM = (typeof FCM)[keyof typeof FCM];
export type Category = Cardio | Strength | Flexibility;
export type MET_CARDIO = (typeof MET_CARDIO)[keyof typeof MET_CARDIO];
export type MET_STRENGTH = (typeof MET_STRENGTH)[keyof typeof MET_STRENGTH];
export type MET_FLEXIBILITY =
  (typeof MET_FLEXIBILITY)[keyof typeof MET_FLEXIBILITY];
