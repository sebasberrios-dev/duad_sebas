import ExerciseCard from "../ExerciseCard";
import { ExerciseCatalogProps } from "../props/exercise-catalog-props";
import Loader from "../../../components/Loader/Loader";
import { IconWarning } from "../icons";

export default function ExercisesCatalogField({
  exercises,
  error,
  loading,
  onAdd,
}: ExerciseCatalogProps) {
  const incompleteExercises = exercises.filter(
    (ex) => !ex.category || !ex.description,
  );

  const completeExercises = exercises.filter(
    (ex) => ex.category && ex.description && ex.exerciseName,
  );

  if (loading) {
    return <Loader message="Cargando ejercicios" className="mt-9 ml-26" />;
  }
  if (error)
    return (
      <p className="text-red-600 mt-9 ml-26">
        Ocurrió un error cargando los ejercicios
      </p>
    );
  if (exercises.length === 0) {
    return (
      <p className="text-gray-500 mt-9 mb-3 ml-26">
        No se encontraron ejercicios
      </p>
    );
  }

  return (
    <div className="ml-24 mt-9 max-w-7xl flex flex-col gap-3">
      {incompleteExercises.length > 0 && (
        <p className="text-yellow-500 text-sm mb-4 flex flex-row gap-2 items-center">
          {" "}
          <IconWarning />
          Hay ejercicios con información incompleta:{" "}
          {incompleteExercises.map((ex) => ex.exerciseName).join(", ")}
        </p>
      )}
      <div className="grid grid-cols-3 gap-x-4 gap-y-8 place-items-start">
        {completeExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}
