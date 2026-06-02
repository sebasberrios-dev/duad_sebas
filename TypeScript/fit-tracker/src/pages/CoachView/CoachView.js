import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { useUsers } from "../../context/UserContext";
import { useRoutines } from "../../context/RoutineContext";
import { BigTitle } from "../../components/Title/BigTitle";
import { WeeklyLoadTable } from "../../features/system-dashboard/WeeklyLoadTable";
export default function CoachView() {
    const { findById } = useUsers();
    const { findRoutineById } = useRoutines();
    const { currentUser, isCoach, isUser } = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser || !isCoach(currentUser)) {
            navigate("/coach/login", { replace: true });
        }
    }, [currentUser]);
    if (!currentUser || !isCoach(currentUser))
        return null;
    const clientUsers = currentUser.clients
        .map((c) => findById(c.id))
        .filter((u) => {
        if (u === undefined || !isUser(u))
            return false;
        const routine = findRoutineById(u.routineId);
        return routine !== undefined && routine.workouts.length > 0;
    });
    return (_jsxs("div", { className: "p-8 w-full h-full mt-7 animate-slide-up-fade", children: [_jsx(BigTitle, { className: "text-center mb-8", children: "Mis clientes" }), _jsx("div", { className: "bg-gray-900 rounded-xl p-5", children: _jsx(WeeklyLoadTable, { users: clientUsers, firstColumnLabel: "Cliente", showAge: true, showWeight: true }) })] }));
}
