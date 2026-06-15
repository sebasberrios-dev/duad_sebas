import { useState } from "react";
import { CardContainer } from "../../components/Container/CardContainer";
import { CatalogExercise } from "../catalog-exercise/types/catalog-exercise.types";

const MAX_LENGTH = 200;

export default function ExerciseCard({
  exercise,
  onAdd,
}: {
  exercise: CatalogExercise;
  onAdd?: (exercise: CatalogExercise) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = exercise.description.length > MAX_LENGTH;
  const displayedText =
    isLong && !expanded
      ? exercise.description.slice(0, MAX_LENGTH).trimEnd() + "..."
      : exercise.description;

  return (
    <CardContainer className="gap-2">
      <h2 className="text-lg font-semibold text-white truncate">
        {exercise.exerciseName}
      </h2>
      <h4 className="text-xs text-gray-400 tracking-widest">
        {exercise.category}
      </h4>
      <p className="text-sm text-gray-300 mt-3">
        {displayedText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-green-400 hover:text-green-300 text-xs font-medium"
          >
            {expanded ? "ver menos" : "ver más"}
          </button>
        )}
      </p>
      {onAdd && (
        <button
          type="button"
          onClick={() => onAdd(exercise)}
          className="mt-auto w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2 text-sm transition cursor-pointer"
        >
          Agregar
        </button>
      )}
    </CardContainer>
  );
}
