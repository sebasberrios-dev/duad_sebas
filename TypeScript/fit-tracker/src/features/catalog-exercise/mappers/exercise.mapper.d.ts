import { CatalogExercise } from "../types/catalog-exercise.types";
import { ApiCatalogExercise } from "../types/api-exercise.dto";
export declare function mapTypeToCategory(type: string): CatalogExercise["category"];
export declare function mapApiExercisetoCatalogExercise(dto: ApiCatalogExercise, index: number): CatalogExercise;
