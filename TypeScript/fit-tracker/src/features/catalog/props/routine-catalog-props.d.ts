import { CatalogExercise } from "../../catalog-exercise/types/catalog-exercise.types";
interface className {
    layout?: string;
    errorMessage?: string;
    emptyMessage?: string;
}
export interface RoutineCatalogProps {
    exercises: CatalogExercise[];
    onAdd: (exercise: CatalogExercise) => void;
    loading?: boolean;
    error?: boolean;
    className?: className;
}
export {};
