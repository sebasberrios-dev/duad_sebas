import { CatalogExercise } from "../catalog-exercise/types/catalog-exercise.types";
export default function ExerciseCard({ exercise, onAdd, }: {
    exercise: CatalogExercise;
    onAdd?: (exercise: CatalogExercise) => void;
}): import("react/jsx-runtime").JSX.Element;
