import { CatalogExercise } from "../../catalog-exercise/types/catalog-exercise.types";

export interface ExerciseCatalogProps {
  exercises: CatalogExercise[];
  error?: boolean;
  loading?: boolean;
  onAdd?: (exercise: CatalogExercise) => void;
}
