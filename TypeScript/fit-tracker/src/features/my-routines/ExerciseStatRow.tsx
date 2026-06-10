import { Exercise } from "../../types/interfaces";
import { FCM_ZONE_LABELS } from "../../types/types";

const STATUS_STYLES: Record<Exercise["status"], string> = {
  pending: "text-gray-500",
  completed: "text-green-400",
  skipped: "text-red-400",
};

const STATUS_LABELS: Record<Exercise["status"], string> = {
  pending: "Pendiente",
  completed: "Completado",
  skipped: "Omitido",
};

function getStats(exercise: Exercise): string {
  const { details } = exercise;
  switch (details.category) {
    case "Fuerza": {
      const totalReps = details.sets.reduce((acc, s) => acc + s.reps, 0);
      const totalWeight = details.sets.reduce((acc, s) => acc + s.weightKg, 0);
      return `${details.sets.length} series · ${totalReps} reps · ${totalWeight} kg`;
    }
    case "Cardio":
      return `${details.distanceKm} km · ${FCM_ZONE_LABELS[details.fcm]}`;
    case "Flexibilidad":
      return `${details.poses} poses`;
    case "Descanso":
      return "Descanso";
  }
}

interface ExerciseStatRowProps {
  exercise: Exercise;
}

export function ExerciseStatRow({ exercise }: ExerciseStatRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-white">{exercise.exerciseName}</p>
        <p className="text-xs text-gray-400">
          {exercise.details.category} · {exercise.durationMinutes} min
        </p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <p className="text-xs text-blue-400 font-medium">{getStats(exercise)}</p>
        <p className={`text-xs font-medium ${STATUS_STYLES[exercise.status]}`}>
          {STATUS_LABELS[exercise.status]}
        </p>
      </div>
    </div>
  );
}
