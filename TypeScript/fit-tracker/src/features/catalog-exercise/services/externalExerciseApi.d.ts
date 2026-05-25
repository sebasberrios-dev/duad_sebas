import { CatalogExercise } from "../types/catalog-exercise.types";
export declare function getExternalExercisesByMuscle(muscle: string): Promise<CatalogExercise[]>;
export declare function getExternalExercisesByType(type: string): Promise<CatalogExercise[]>;
