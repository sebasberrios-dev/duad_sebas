import { CatalogExercise } from "../types/catalog-exercise.types";
import { ApiCatalogExercise } from "../types/api-exercise.dto";
import { mapApiExercisetoCatalogExercise } from "../mappers/exercise.mapper";

const options = {
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
};

export async function getExternalExercisesByMuscle(
  muscle: string,
): Promise<CatalogExercise[]> {
  const response = await fetch(
    `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
    options,
  );

  if (!response.ok) {
    throw new Error("Error obteniendo ejercicios");
  }

  const data: ApiCatalogExercise[] = await response.json();

  return data.map(mapApiExercisetoCatalogExercise);
}

export async function getExternalExercisesByType(
  type: string,
): Promise<CatalogExercise[]> {
  const response = await fetch(
    `https://api.api-ninjas.com/v1/exercises?type=${type}`,
    options,
  );

  if (!response.ok) {
    throw new Error("Error obteniendo ejercicios");
  }

  const data: ApiCatalogExercise[] = await response.json();

  return data.map(mapApiExercisetoCatalogExercise);
}
