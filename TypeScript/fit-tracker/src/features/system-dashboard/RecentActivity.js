import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRoutines } from "../../context/RoutineContext";
import { formatDate } from "../../utils/utilities";
export function RecentActivity({ users, limit = 5 }) {
    const { findRoutineById } = useRoutines();
    if (users.length === 0)
        return _jsx("p", { className: "text-sm text-gray-600", children: "No hay actividad reciente." });
    const recent = users
        .map((u) => ({ user: u, routine: findRoutineById(u.routineId) }))
        .filter((entry) => entry.routine !== undefined)
        .sort((a, b) => new Date(b.routine.routineStartDate).getTime() -
        new Date(a.routine.routineStartDate).getTime())
        .slice(0, limit);
    return (_jsx("ul", { className: "flex flex-col gap-2", children: recent.map(({ user, routine }) => (_jsxs("li", { className: "flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0", children: [_jsxs("div", { className: "flex flex-col gap-0.5", children: [_jsx("span", { className: "text-white font-medium", children: user.name }), _jsx("span", { className: "text-xs text-gray-500", children: routine.routineName })] }), _jsx("span", { className: "text-xs text-gray-500", children: formatDate(routine.routineStartDate) })] }, user.id))) }));
}
