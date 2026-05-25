import { jsx as _jsx } from "react/jsx-runtime";
import ExerciseCard from "../ExerciseCard";
import Loader from "../../../components/Loader/Loader";
import { twMerge } from "tailwind-merge";
export default function RoutineCatalogField({ exercises, onAdd, loading, error, className, }) {
    if (loading) {
        return _jsx(Loader, { message: "Cargando ejercicios", className: "mt-9 ml-26" });
    }
    if (error) {
        return (_jsx("p", { className: twMerge("text-red-600 mt-9 ml-26", className?.errorMessage), children: "Ocurri\u00F3 un error cargando los ejercicios" }));
    }
    const completeExercises = exercises.filter((ex) => ex.category && ex.description);
    if (completeExercises.length === 0) {
        return (_jsx("p", { className: twMerge("text-gray-500 mt-9 ml-26", className?.emptyMessage), children: "No se encontraron ejercicios" }));
    }
    return (_jsx("div", { className: twMerge("grid grid-cols-3 gap-x-4 gap-y-8 max-w-7xl ml-24 mt-9 place-items-start", className?.layout), children: completeExercises.map((exercise) => (_jsx(ExerciseCard, { exercise: exercise, onAdd: onAdd }, exercise.id))) }));
}
