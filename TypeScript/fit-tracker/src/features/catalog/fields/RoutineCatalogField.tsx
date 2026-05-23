import { RoutineCatalogProps } from "../props/routine-catalog-props";
import ExerciseCard from "../ExerciseCard";
import Loader from "../../../components/Loader/Loader";
import { twMerge } from "tailwind-merge";

export default function RoutineCatalogField({
  exercises,
  onAdd,
  loading,
  error,
  className,
}: RoutineCatalogProps) {
  if (loading) {
    return <Loader message="Cargando ejercicios" className="mt-9 ml-26" />;
  }
  if (error) {
    return (
      <p
        className={twMerge("text-red-600 mt-9 ml-26", className?.errorMessage)}
      >
        Ocurrió un error cargando los ejercicios
      </p>
    );
  }
  const completeExercises = exercises.filter(
    (ex) => ex.category && ex.description,
  );

  if (completeExercises.length === 0) {
    return (
      <p
        className={twMerge("text-gray-500 mt-9 ml-26", className?.emptyMessage)}
      >
        No se encontraron ejercicios
      </p>
    );
  }

  return (
    <div
      className={twMerge(
        "grid grid-cols-3 gap-x-4 gap-y-8 max-w-7xl ml-24 mt-9 place-items-start",
        className?.layout,
      )}
    >
      {completeExercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} onAdd={onAdd} />
      ))}
    </div>
  );
}
