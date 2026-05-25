import z from "zod";
import type { Exercise } from "./interfaces";
declare const Days: {
    readonly monday: "Lunes";
    readonly tuesday: "Martes";
    readonly wednesday: "Miercoles";
    readonly thursday: "Jueves";
    readonly friday: "Viernes";
};
export type Days = (typeof Days)[keyof typeof Days];
export declare const DAYS_LIST: Days[];
export declare const FCM_ZONES: readonly ["zone1", "zone2", "zone3", "zone4", "zone5"];
export declare const fcmZoneSchema: z.ZodEnum<{
    zone1: "zone1";
    zone2: "zone2";
    zone3: "zone3";
    zone4: "zone4";
    zone5: "zone5";
}>;
export type fcmZone = z.infer<typeof fcmZoneSchema>;
export declare const FCM_ZONE_LABELS: Record<fcmZone, string>;
declare const MET_CARDIO: {
    readonly veryLight: 3.5;
    readonly light: 4;
    readonly moderate: 7;
    readonly intense: 11;
    readonly max: 13;
};
export declare const LEVEL_TO_MET_STRENGTH: Record<Level, MET_STRENGTH>;
export declare const LEVEL_TO_MET_FLEXIBILITY: Record<Level, MET_FLEXIBILITY>;
export declare const FCM_TO_MET: Record<fcmZone, MET_CARDIO>;
declare const MET_STRENGTH: {
    readonly light: 3.5;
    readonly moderate: 5;
    readonly intense: 6;
};
declare const MET_FLEXIBILITY: {
    readonly light: 2.3;
    readonly moderate: 2.5;
    readonly intense: 3;
};
export declare const USER_LEVELS: {
    readonly BEGINNER: "Principiante";
    readonly INTERMEDIATE: "Intermedio";
    readonly ADVANCED: "Avanzado";
};
export declare const EXPERIENCE_LEVELS: {
    JUNIOR: string;
    INTERMEDIATE: string;
    SENIOR: string;
    EXPERT: string;
};
export declare const EXERCISES_CATEGORIES: readonly ["Cardio", "Fuerza", "Flexbilidad"];
export declare const WORKOUT_STATUSES: readonly ["pending", "completed", "skipped"];
export declare const experienceSchema: z.ZodEnum<{
    JUNIOR: string;
    INTERMEDIATE: string;
    SENIOR: string;
    EXPERT: string;
}>;
export type Level = (typeof USER_LEVELS)[keyof typeof USER_LEVELS];
export type Experience = (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];
export type ExerciseCategory = (typeof EXERCISES_CATEGORIES)[number];
export type WorkoutStatus = (typeof WORKOUT_STATUSES)[number];
export type MET_CARDIO = (typeof MET_CARDIO)[keyof typeof MET_CARDIO];
export type MET_STRENGTH = (typeof MET_STRENGTH)[keyof typeof MET_STRENGTH];
export type MET_FLEXIBILITY = (typeof MET_FLEXIBILITY)[keyof typeof MET_FLEXIBILITY];
export type DraftRoutine = Partial<Record<Days, Exercise[]>>;
export {};
