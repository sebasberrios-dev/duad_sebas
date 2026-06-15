import { CatalogExercise } from "../features/catalog-exercise/types/catalog-exercise.types";

export interface CategoryGroup {
  category: string;
  count: number;
  local: number;
  api: number;
  exercises: CatalogExercise[];
}

export interface CatalogReport {
  generatedAt: string;
  totals: {
    total: number;
    local: number;
    api: number;
  };
  byCategory: CategoryGroup[];
  incomplete: CatalogExercise[];
  rejected: CatalogExercise[];
}
