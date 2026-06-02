import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "../../context/SessionContext";
import { useRoutines } from "../../context/RoutineContext";
import { BigTitle } from "../../components/Title/BigTitle";
import { WorkoutDaySection } from "../../features/my-routines/WorkoutDaySection";
export default function MyRoutines() {
    const { currentUser, isUser } = useSession();
    const { findRoutineById } = useRoutines();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentUser || !isUser(currentUser)) {
            navigate("/login", { replace: true });
        }
    }, [currentUser]);
    if (!currentUser || !isUser(currentUser))
        return null;
    const routine = findRoutineById(currentUser.routineId);
    return (_jsx("div", { className: "p-8 w-full h-full mt-7 animate-slide-up-fade", children: !routine || routine.workouts.length === 0 ? (_jsx("div", { className: "flex flex-col items-center justify-center h-full gap-3", children: _jsx("p", { className: "text-gray-400 text-sm", children: "No tienes ninguna rutina asignada a\u00FAn." }) })) : (_jsxs("div", { className: "flex flex-col gap-8 max-w-2xl mx-auto", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(BigTitle, { children: routine.routineName }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Desde", " ", new Date(routine.routineStartDate).toLocaleDateString("es-AR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })] })] }), _jsx("div", { className: "flex flex-col gap-6", children: routine.workouts.map((workout) => (_jsx(WorkoutDaySection, { workout: workout }, workout.day.join("-")))) })] })) }));
}
