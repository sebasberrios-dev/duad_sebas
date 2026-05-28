import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExerciseStatRow } from "./ExerciseStatRow";
export function WorkoutDaySection({ workout }) {
    return (_jsxs("div", { className: "flex flex-col gap-2 mb-5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h3", { className: "text-sm font-semibold text-white uppercase tracking-wide", children: workout.day.join(" / ") }), workout.comment && (_jsx("span", { className: "text-xs text-gray-500 italic", children: workout.comment }))] }), _jsx("div", { className: "flex flex-col gap-2", children: workout.exercises.map((exercise) => (_jsx(ExerciseStatRow, { exercise: exercise }, exercise.id))) })] }));
}
