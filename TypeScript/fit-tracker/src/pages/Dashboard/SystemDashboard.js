import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useCatalog } from "../../context/CatalogContext";
import { useUsers } from "../../context/UserContext";
import { useRoutines } from "../../context/RoutineContext";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { BigTitle } from "../../components/Title/BigTitle";
import { StatsCard } from "../../features/system-dashboard/StatsCard";
import { WeeklyLoadTable } from "../../features/system-dashboard/WeeklyLoadTable";
import { QuickNav } from "../../features/system-dashboard/QuickNav";
import { CategoryBreakdown } from "../../features/system-dashboard/CategoryBreakdown";
import { RecentActivity } from "../../features/system-dashboard/RecentActivity";
export default function SystemDashboard() {
    const { users, coachs, admins } = useUsers();
    const { findRoutineById } = useRoutines();
    const { catalog } = useCatalog();
    const { currentUser, isAdmin } = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser || !isAdmin(currentUser)) {
            navigate("/admin/login", { replace: true });
        }
    }, [currentUser]);
    if (!currentUser || !isAdmin(currentUser))
        return null;
    const localCount = catalog.filter((ex) => ex.source === "local").length;
    const apiCount = catalog.filter((ex) => ex.source === "api").length;
    const activeUsers = users.filter((u) => {
        const routine = findRoutineById(u.routineId);
        return routine !== undefined && routine.workouts.length > 0;
    });
    return (_jsxs("div", { className: "p-8 w-full h-full overflow-y-auto animate-slide-up-fade", children: [_jsx(BigTitle, { className: "text-center mb-8", children: "Estado del sistema" }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mb-10", children: [_jsx(StatsCard, { title: "Usuarios registrados", value: users.length, detail: `${users.length} usuarios | ${coachs.length} coaches | ${admins.length} admins` }), _jsx(StatsCard, { title: "Cat\u00E1logo de ejercicios", value: catalog.length, detail: `${localCount} locales | ${apiCount} desde API` }), _jsx(StatsCard, { title: "Rutinas activas", value: activeUsers.length, detail: `de ${users.length} usuarios totales` })] }), _jsxs("div", { className: "bg-gray-900 rounded-xl p-5 mb-10", children: [_jsx("p", { className: "text-sm font-semibold text-gray-300 mb-4", children: "Carga semanal por usuario" }), _jsx(WeeklyLoadTable, { users: activeUsers, showMinutes: true, showCalories: true })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6 mb-10", children: [_jsxs("div", { className: "bg-gray-900 rounded-xl p-5", children: [_jsx("p", { className: "text-sm font-semibold text-gray-300 mb-4", children: "Ejercicios por categor\u00EDa" }), _jsx(CategoryBreakdown, { users: activeUsers })] }), _jsxs("div", { className: "bg-gray-900 rounded-xl p-5", children: [_jsx("p", { className: "text-sm font-semibold text-gray-300 mb-4", children: "Actividad reciente" }), _jsx(RecentActivity, { users: activeUsers })] })] }), _jsxs("div", { className: "bg-gray-900 rounded-xl p-5", children: [_jsx("p", { className: "text-sm font-semibold text-gray-300 mb-4", children: "Acceso r\u00E1pido" }), _jsx(QuickNav, {})] })] }));
}
