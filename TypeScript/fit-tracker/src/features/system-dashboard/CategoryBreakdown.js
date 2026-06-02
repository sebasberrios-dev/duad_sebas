import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRoutines } from "../../context/RoutineContext";
import { getTotalExercisesByCategory } from "../../utils/utilities";
export function CategoryBreakdown({ users }) {
    const { findRoutineById } = useRoutines();
    if (users.length === 0)
        return _jsx("p", { className: "text-sm text-gray-600", children: "No hay rutinas activas." });
    const totals = users.reduce((acc, u) => {
        const routine = findRoutineById(u.routineId);
        if (!routine)
            return acc;
        const { totalCardio, totalStrength, totalFlex } = getTotalExercisesByCategory(routine);
        return {
            cardio: acc.cardio + totalCardio,
            strength: acc.strength + totalStrength,
            flex: acc.flex + totalFlex,
        };
    }, { cardio: 0, strength: 0, flex: 0 });
    const items = [
        { label: "Cardio", value: totals.cardio, color: "text-blue-400" },
        { label: "Fuerza", value: totals.strength, color: "text-green-400" },
        { label: "Flexibilidad", value: totals.flex, color: "text-purple-400" },
    ];
    return (_jsx("div", { className: "grid grid-cols-3 gap-4", children: items.map(({ label, value, color }) => (_jsxs("div", { className: "flex flex-col items-center bg-gray-800 rounded-lg py-4", children: [_jsx("span", { className: `text-2xl font-bold ${color}`, children: value }), _jsx("span", { className: "text-xs text-gray-400 mt-1", children: label })] }, label))) }));
}
