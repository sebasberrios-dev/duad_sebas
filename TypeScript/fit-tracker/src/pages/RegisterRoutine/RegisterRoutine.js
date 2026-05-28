import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "../../context/SessionContext";
import { useCatalog } from "../../context/CatalogContext";
import { DAYS_LIST } from "../../types/types";
import Modal from "../../components/Modal/Modal";
import RegisterExercise from "../../features/routine-exercise/RegisterExercise";
import { Button } from "../../components/Button/Button";
import RoutineNameField from "../../features/routine/fields/RoutineNameField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerRoutineSchema, } from "../../features/routine/schema/routineSchema";
import { printRoutine, printWeeklyLoad } from "../../utils/console";
import SelectInput from "../../components/Form/Input/SelectInput";
import RoutineCatalogField from "../../features/catalog/fields/RoutineCatalogField";
import { muscleOptions, categoryOptions, } from "../../features/catalog-exercise/types/options";
import { daysOptions } from "../../features/routine/types/options";
export default function RegisterRoutine() {
    const [draft, setDraft] = useState({});
    const [draftComments, setDraftComments] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMuscle, setSelectedMuscle] = useState("");
    const [catalogExerciseToAdd, setCatalogExerciseToAdd] = useState(null);
    const { currentUser, updateCurrentUser, isUser, isAdmin } = useSession();
    const navigate = useNavigate();
    const { catalog } = useCatalog();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registerRoutineSchema),
    });
    useEffect(() => {
        if (!currentUser || (!isUser(currentUser) && !isAdmin(currentUser))) {
            navigate("/login", { replace: true });
        }
    }, [currentUser]);
    if (!currentUser || (!isUser(currentUser) && !isAdmin(currentUser)))
        return null;
    const filteredExercises = catalog.filter((ex) => {
        const matchesCategory = selectedCategory
            ? ex.category === selectedCategory
            : true;
        const matchesMuscle = selectedMuscle ? ex.muscle === selectedMuscle : true;
        return matchesCategory && matchesMuscle;
    });
    function isDays(val) {
        return DAYS_LIST.some((day) => day === val);
    }
    function handleCategoryChange(category) {
        setSelectedCategory(category);
        setSelectedMuscle("");
    }
    function handleMuscleChange(muscle) {
        setSelectedMuscle(muscle);
    }
    function handleExerciseAdded(exercise) {
        if (!selectedDay)
            return;
        setDraft((prev) => ({
            ...prev,
            [selectedDay]: [...(prev[selectedDay] ?? []), exercise],
        }));
        setIsModalOpen(false);
    }
    function handleAddFromCatalog(exercise) {
        if (!selectedDay || !exercise.category)
            return;
        setCatalogExerciseToAdd(exercise);
        setIsModalOpen(true);
    }
    function handleSaveRoutine(data) {
        if (!currentUser)
            return;
        const workouts = Object.entries(draft).flatMap(([day, exercises]) => {
            if (!isDays(day) || !exercises)
                return [];
            return [{ day: [day], exercises, comment: draftComments[day] }];
        });
        const updatedUser = {
            ...currentUser,
            routine: {
                id: Date.now(),
                routineName: data.routineName,
                routineStartDate: new Date().toISOString(),
                workouts,
            },
        };
        updateCurrentUser(updatedUser);
        setDraft({});
        setDraftComments({});
    }
    function handleClearRoutine() {
        setDraft({});
        setDraftComments({});
    }
    function handleSeeRoutine() {
        if (!currentUser || !isUser(currentUser))
            return;
        printRoutine(currentUser.routine, currentUser);
        printWeeklyLoad(currentUser.routine, currentUser);
    }
    return (_jsxs(_Fragment, { children: [_jsx(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), children: selectedDay && (_jsx(RegisterExercise, { day: selectedDay, preloaded: catalogExerciseToAdd ?? undefined, onSuccess: handleExerciseAdded })) }), _jsxs("div", { className: "flex flex-row gap-6 p-6 w-full h-full mt-7 animate-slide-up-fade", children: [_jsxs("div", { className: " flex flex-col gap-4 p-2 w-72 shrink-0 border-0", children: [_jsx(RoutineNameField, { control: control }), _jsx(SelectInput, { id: "day-select", value: selectedDay ?? "", onChange: (val) => {
                                    if (isDays(val))
                                        setSelectedDay(val);
                                }, options: daysOptions, placeholder: "Seleccionar d\u00EDa", className: "bg-gray-900 border-none" }), _jsx("div", { className: "flex flex-col gap-3 mt-2", children: DAYS_LIST.map((day) => (_jsxs("div", { className: "py-3 border-b", children: [_jsx("p", { className: "text-sm font-semibold text-white mb-1", children: day }), draft[day]?.length ? (draft[day].map((ex) => (_jsx("p", { className: "text-xs text-gray-400 pl-1 py-0.5", children: ex.exerciseName }, ex.id)))) : (_jsx("p", { className: "text-xs text-gray-600 pl-1.5", children: "Sin ejercicios" }))] }, day))) }), _jsxs("div", { className: "flex flex-col gap-2 mt-auto pt-4", children: [_jsx(Button, { type: "button", onClick: handleSubmit(handleSaveRoutine), children: "Guardar rutina" }), _jsx(Button, { type: "button", onClick: handleClearRoutine, className: "bg-red-800 hover:bg-red-700 active:bg-red-900", children: "Limpiar rutina" }), _jsx(Button, { type: "button", onClick: handleSeeRoutine, children: "Ver rutina" })] })] }), _jsx("div", { className: "w-px bg-gray-800 shrink-0 self-stretch shadow-lg" }), _jsxs("div", { className: "flex flex-col flex-1 overflow-y-auto", children: [_jsxs("div", { className: "flex flex-row items-center gap-5 mb-4", children: [_jsx(SelectInput, { id: "category-filter", value: selectedCategory, onChange: handleCategoryChange, options: categoryOptions, placeholder: "Filtrar por categor\u00EDa", className: "bg-gray-900 border-none w-56 mt-1 ml-1" }), selectedCategory === "Fuerza" && (_jsx(SelectInput, { id: "muscle-filter", value: selectedMuscle, onChange: handleMuscleChange, options: muscleOptions, placeholder: "Filtrar por m\u00FAsculo", className: "bg-gray-900 border-none w-56 mt-1" })), !selectedDay && (_jsx("p", { className: "text-red-600 text-sm", children: "Seleccion\u00E1 un d\u00EDa para poder agregar ejercicios" }))] }), _jsx("div", { className: "flex flex-col", children: _jsx(RoutineCatalogField, { exercises: filteredExercises, onAdd: handleAddFromCatalog, className: {
                                        layout: "ml-6",
                                        errorMessage: "ml-6",
                                        emptyMessage: "ml-6",
                                    } }) })] })] })] }));
}
