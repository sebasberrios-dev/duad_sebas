import { DailyWorkout } from "../../types/interfaces";
import { ExerciseStatRow } from "./ExerciseStatRow";

interface WorkoutDaySectionProps {
  workout: DailyWorkout;
}

export function WorkoutDaySection({ workout }: WorkoutDaySectionProps) {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          {workout.day.join(" / ")}
        </h3>
        {workout.comment && (
          <span className="text-xs text-gray-500 italic">
            {workout.comment}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {workout.exercises.map((exercise) => (
          <ExerciseStatRow key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
