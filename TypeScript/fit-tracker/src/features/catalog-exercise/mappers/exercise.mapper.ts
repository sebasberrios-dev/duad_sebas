import { CatalogExercise } from "../types/catalog-exercise.types";
import { ApiCatalogExercise } from "../types/api-exercise.dto";

export function mapTypeToCategory(type: string): CatalogExercise["category"] {
  const normalizedType = type.toLowerCase().trim();

  switch (normalizedType) {
    case "strength":
      return "Fuerza";
    case "cardio":
      return "Cardio";
    case "stretching":
      return "Flexibilidad";

    default:
      return "Fuerza";
  }
}

export function mapApiExercisetoCatalogExercise(
  dto: ApiCatalogExercise,
  index: number,
): CatalogExercise {
  return {
    id: index + 1,
    exerciseName: dto.name,
    category: mapTypeToCategory(dto.type),
    muscle: dto.muscle,
    description: dto.instructions,
  };
}
