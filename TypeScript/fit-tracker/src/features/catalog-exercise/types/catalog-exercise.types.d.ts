import { Category } from "../../../types/interfaces";
export type ExerciseSource = "local" | "api";
export interface CatalogExercise {
    id: number;
    exerciseName: string;
    category?: Category["category"];
    muscle?: string;
    description: string;
    source: ExerciseSource;
}
