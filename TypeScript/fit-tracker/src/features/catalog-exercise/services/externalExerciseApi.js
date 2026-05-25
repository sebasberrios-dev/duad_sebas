import { mapApiExercisetoCatalogExercise } from "../mappers/exercise.mapper";
const options = {
    headers: {
        "x-api-key": import.meta.env.VITE_API_KEY,
    },
};
export async function getExternalExercisesByMuscle(muscle) {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, options);
    if (!response.ok) {
        throw new Error("Error obteniendo ejercicios");
    }
    const data = await response.json();
    return data.map(mapApiExercisetoCatalogExercise);
}
export async function getExternalExercisesByType(type) {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?type=${type}`, options);
    if (!response.ok) {
        throw new Error("Error obteniendo ejercicios");
    }
    const data = await response.json();
    return data.map(mapApiExercisetoCatalogExercise);
}
