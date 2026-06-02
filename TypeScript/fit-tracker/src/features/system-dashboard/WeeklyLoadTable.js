import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRoutines } from "../../context/RoutineContext";
import { getTotalDuration, calculateAllCalories, calculateWeeklyAvgCalories, getWeeklyRecommendation, } from "../../utils/utilities";
export function WeeklyLoadTable({ users, firstColumnLabel = "Usuario", showAge = false, showWeight = false, showMinutes = false, showCalories = false, }) {
    const { findRoutineById } = useRoutines();
    if (users.length === 0)
        return (_jsx("p", { className: "text-sm text-gray-600", children: "No hay usuarios con rutinas activas." }));
    return (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-gray-500 border-b border-gray-800", children: [_jsx("th", { className: "pb-2 font-medium", children: firstColumnLabel }), showAge && _jsx("th", { className: "pb-2 font-medium", children: "Edad" }), showWeight && _jsx("th", { className: "pb-2 font-medium", children: "Peso" }), _jsx("th", { className: "pb-2 font-medium", children: "Nivel" }), _jsx("th", { className: "pb-2 font-medium", children: "Rutina" }), _jsx("th", { className: "pb-2 font-medium", children: "Duraci\u00F3n" }), showMinutes && _jsx("th", { className: "pb-2 font-medium", children: "Minutos" }), showCalories && _jsx("th", { className: "pb-2 font-medium", children: "Calor\u00EDas" }), _jsx("th", { className: "pb-2 font-medium", children: "D\u00EDas" }), _jsx("th", { className: "pb-2 font-medium", children: "Recomendaci\u00F3n" })] }) }), _jsx("tbody", { children: users.map((u) => {
                    const routine = findRoutineById(u.routineId);
                    if (!routine)
                        return null;
                    const { formatTotalDuration, total } = getTotalDuration(routine);
                    const { totalCalories } = calculateAllCalories(routine, u.bodyWeight, u.level);
                    const { uniqueDays } = calculateWeeklyAvgCalories(routine, totalCalories);
                    const recommendation = getWeeklyRecommendation(routine, u.bodyWeight, u.level);
                    return (_jsxs("tr", { className: "border-b border-gray-800 last:border-0", children: [_jsx("td", { className: "py-3", children: u.name }), showAge && _jsx("td", { className: "py-3 text-gray-400", children: u.age }), showWeight && (_jsxs("td", { className: "py-3 text-gray-400", children: [u.bodyWeight, " kg"] })), _jsx("td", { className: "py-3 text-gray-400", children: u.level }), _jsx("td", { className: "py-3 text-gray-400", children: routine.routineName }), _jsx("td", { className: "py-3 text-gray-400", children: formatTotalDuration }), showMinutes && (_jsxs("td", { className: "py-3 text-gray-400", children: [total, " min"] })), showCalories && (_jsxs("td", { className: "py-3 text-gray-400", children: [totalCalories, " kcal"] })), _jsx("td", { className: "py-3 text-gray-400", children: uniqueDays }), _jsx("td", { className: "py-3 text-gray-400", children: recommendation })] }, u.id));
                }) })] }));
}
