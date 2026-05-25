import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { CardContainer } from "../../components/Container/CardContainer";
const MAX_LENGTH = 200;
export default function ExerciseCard({ exercise, onAdd, }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = exercise.description.length > MAX_LENGTH;
    const displayedText = isLong && !expanded
        ? exercise.description.slice(0, MAX_LENGTH).trimEnd() + "..."
        : exercise.description;
    return (_jsxs(CardContainer, { className: "gap-2", children: [_jsx("h2", { className: "text-lg font-semibold text-white truncate", children: exercise.exerciseName }), _jsx("h4", { className: "text-xs text-gray-400 tracking-widest", children: exercise.category }), _jsxs("p", { className: "text-sm text-gray-300 mt-3", children: [displayedText, isLong && (_jsx("button", { onClick: () => setExpanded(!expanded), className: "ml-1 text-green-400 hover:text-green-300 text-xs font-medium", children: expanded ? "ver menos" : "ver más" }))] }), onAdd && (_jsx("button", { type: "button", onClick: () => onAdd(exercise), className: "mt-auto w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2 text-sm transition cursor-pointer", children: "Agregar" }))] }));
}
