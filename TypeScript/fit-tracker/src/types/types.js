import z from "zod";
const Days = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miercoles",
    thursday: "Jueves",
    friday: "Viernes",
};
export const DAYS_LIST = Object.values(Days);
export const FCM_ZONES = ["zone1", "zone2", "zone3", "zone4", "zone5"];
export const fcmZoneSchema = z.enum(FCM_ZONES);
export const FCM_ZONE_LABELS = {
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
};
export const LEVEL_TO_MET_STRENGTH = {
    Principiante: 3.5,
    Intermedio: 5.0,
    Avanzado: 6.0,
};
export const LEVEL_TO_MET_FLEXIBILITY = {
    Principiante: 2.3,
    Intermedio: 2.5,
    Avanzado: 3.0,
};
export const FCM_TO_MET = {
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
};
const MET_FLEXIBILITY = {
    light: 2.3,
    moderate: 2.5,
    intense: 3.0,
};
export const USER_LEVELS = {
    BEGINNER: "Principiante",
    INTERMEDIATE: "Intermedio",
    ADVANCED: "Avanzado",
};
export const EXPERIENCE_LEVELS = {
    JUNIOR: "junior",
    INTERMEDIATE: "intermediate",
    SENIOR: "senior",
    EXPERT: "expert",
};
export const EXERCISES_CATEGORIES = [
    "Cardio",
    "Fuerza",
    "Flexbilidad",
];
export const WORKOUT_STATUSES = ["pending", "completed", "skipped"];
export const experienceSchema = z.enum(EXPERIENCE_LEVELS);
