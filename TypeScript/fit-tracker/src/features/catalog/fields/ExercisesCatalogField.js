import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ExerciseCard from "../ExerciseCard";
import Loader from "../../../components/Loader/Loader";
import { IconWarning } from "../icons";
export default function ExercisesCatalogField({ exercises, error, loading, onAdd, }) {
    const incompleteExercises = exercises.filter((ex) => !ex.category || !ex.description);
    const completeExercises = exercises.filter((ex) => ex.category && ex.description && ex.exerciseName);
    if (loading) {
        return _jsx(Loader, { message: "Cargando ejercicios", className: "mt-9 ml-26" });
    }
    if (error)
        return (_jsx("p", { className: "text-red-600 mt-9 ml-26", children: "Ocurri\u00F3 un error cargando los ejercicios" }));
    if (exercises.length === 0) {
        return (_jsx("p", { className: "text-gray-500 mt-9 mb-3 ml-26", children: "No se encontraron ejercicios" }));
    }
    return (_jsxs("div", { className: "ml-24 mt-9 max-w-7xl flex flex-col gap-3", children: [incompleteExercises.length > 0 && (_jsxs("p", { className: "text-yellow-500 text-sm mb-4 flex flex-row gap-2 items-center", children: [" ", _jsx(IconWarning, {}), "Hay ejercicios con informaci\u00F3n incompleta:", " ", incompleteExercises.map((ex) => ex.exerciseName).join(", ")] })), _jsx("div", { className: "grid grid-cols-3 gap-x-4 gap-y-8 place-items-start", children: completeExercises.map((exercise) => (_jsx(ExerciseCard, { exercise: exercise, onAdd: onAdd }, exercise.id))) })] }));
}
