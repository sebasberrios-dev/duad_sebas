import z from "zod";
import type { Exercise } from "./interfaces";

const Days = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miercoles",
  thursday: "Jueves",
  friday: "Viernes",
} as const;
export const DAYS_LIST = Object.values(Days) as Days[];

export const FCM_ZONES = ["zone1", "zone2", "zone3", "zone4", "zone5"] as const;

export const fcmZoneSchema = z.enum(FCM_ZONES);
export type fcmZone = z.infer<typeof fcmZoneSchema>;

export const FCM_ZONE_LABELS: Record<fcmZone, string> = {
  zone1: "Muy Ligera",
  zone2: "Ligera",
  zone3: "Moderada",
  zone4: "Intensa",
  zone5: "Máxima",
};

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

export const FCM_TO_MET: Record<fcmZone, MET_CARDIO> = {
  zone1: 3.5,
  zone2: 4,
  zone3: 7,
  zone4: 11,
  zone5: 13,
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

export const USER_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};
export const EXPERIENCE_LEVELS = {
  JUNIOR: "junior",
  INTERMEDIATE: "intermediate",
  SENIOR: "senior",
  EXPERT: "expert",
};
export const experienceSchema = z.enum(EXPERIENCE_LEVELS);

export type Days = (typeof Days)[keyof typeof Days];
export type Level = (typeof USER_LEVELS)[keyof typeof USER_LEVELS];
export type Experience =
  (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];

export type MET_CARDIO = (typeof MET_CARDIO)[keyof typeof MET_CARDIO];
export type MET_STRENGTH = (typeof MET_STRENGTH)[keyof typeof MET_STRENGTH];
export type MET_FLEXIBILITY =
  (typeof MET_FLEXIBILITY)[keyof typeof MET_FLEXIBILITY];

export type DraftRoutine = Partial<Record<Days, Exercise[]>>;
