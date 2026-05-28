import { Routine, User } from "../types/interfaces";
import { Level } from "../types/types";
export declare function calculateCalories(duration: number, calPerMin: number): number;
export declare function calculateAllCalories(routine: Routine, bodyWeight: number, level: Level): {
    cardioCalories: number;
    strengthCalories: number;
    flexCalories: number;
    perExercise: {
        exerciseName: string;
        calories: number;
    }[];
    totalCalories: number;
};
export declare function calculatePace(duration: number, distance: number): number;
export declare function formatDuration(totalMinutes: number): string;
export declare function formatDate(date: Date | string): string;
export declare function getTotalExercises(routine: Routine): number;
export declare function getTotalExercisesByCategory(routine: Routine): {
    totalCardio: number;
    totalStrength: number;
    totalFlex: number;
};
export declare function getTotalDuration(routine: Routine): {
    cardioDuration: string;
    strengthDuration: string;
    flexDuration: string;
    total: number;
    formatTotalDuration: string;
};
export declare function calculateWeeklyAvgCalories(routine: Routine, totalCalories: number): {
    cal: number;
    uniqueDays: number;
};
export declare function genUniqueId(): number;
export declare function getUserInfo(users: User[], userId: User["id"]): {
    name: string;
    level: Level;
    bodyWeight: number;
    routine: Routine;
} | undefined;
export declare function getWeeklyRecommendation(routine: Routine, bodyWeight: number, level: Level): string;
