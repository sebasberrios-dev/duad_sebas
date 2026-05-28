import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FCM_ZONE_LABELS } from "../../types/types";
const STATUS_STYLES = {
    pending: "text-gray-500",
    completed: "text-green-400",
    skipped: "text-red-400",
};
const STATUS_LABELS = {
    pending: "Pendiente",
    completed: "Completado",
    skipped: "Omitido",
};
function getStats(exercise) {
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
export function ExerciseStatRow({ exercise }) {
    return (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("p", { className: "text-sm font-medium text-white", children: exercise.exerciseName }), _jsxs("p", { className: "text-xs text-gray-400", children: [exercise.details.category, " \u00B7 ", exercise.durationMinutes, " min"] })] }), _jsxs("div", { className: "flex flex-col items-end gap-0.5", children: [_jsx("p", { className: "text-xs text-blue-400 font-medium", children: getStats(exercise) }), _jsx("p", { className: `text-xs font-medium ${STATUS_STYLES[exercise.status]}`, children: STATUS_LABELS[exercise.status] })] })] }));
}
