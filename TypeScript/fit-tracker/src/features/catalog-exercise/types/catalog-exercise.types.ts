import { Category } from "../../../types/interfaces";

export interface CatalogExercise {
  id: number;
  exerciseName: string;
  category: Category["category"];
  muscle?: string;
  description: string;
}
