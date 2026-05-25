import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Navigate } from "react-router";
import SelectInput from "../../components/Form/Input/SelectInput";
import { BigTitle } from "../../components/Title/BigTitle";
import { Button } from "../../components/Button/Button";
import { useCatalog } from "../../context/CatalogContext";
import { useSession } from "../../context/SessionContext";
import ExercisesCatalogField from "../../features/catalog/fields/ExercisesCatalogField";
import { muscleOptions } from "../../features/catalog-exercise/types/options";
import { generateCatalogReport } from "../../utils/catalog-report";
import { printCatalogReport } from "../../utils/console";
import { categoryOptions } from "../../features/catalog-exercise/types/options";
import { categoryToApiType } from "../../features/catalog/types/catalog-types";
export default function Catalog() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedMuscle, setSelectedMuscle] = useState("");
    const { catalog: localExercises, apiCatalog: externalExercises, error, loading, getMuscle, getType, addExercise, } = useCatalog();
    const { currentUser, isAdmin, isUser } = useSession();
    if (currentUser && isUser(currentUser)) {
        return _jsx(Navigate, { to: "/dashboard/routine", replace: true });
    }
    const isAdminUser = !!currentUser && isAdmin(currentUser);
    const filteredLocalExercises = localExercises.filter((e) => {
        const matchesCategory = selectedCategory
            ? e.category === selectedCategory
            : true;
        const matchesMuscle = selectedMuscle ? e.muscle === selectedMuscle : true;
        return matchesCategory && matchesMuscle;
    });
    function handleAddExternalExercise(exercise) {
        addExercise({
            exerciseName: exercise.exerciseName,
            category: exercise.category,
            muscle: exercise.muscle,
            description: exercise.description,
        }, true);
    }
    function handleCategoryChange(category) {
        setSelectedCategory(category);
        setSelectedMuscle("");
        if (isAdminUser)
            getType(categoryToApiType[category]);
    }
    function handleMuscleChange(muscle) {
        setSelectedMuscle(muscle);
        if (isAdminUser)
            getMuscle(muscle);
    }
    function handleGenerateReport() {
        const filter = selectedMuscle
            ? { kind: "muscle", value: selectedMuscle }
            : selectedCategory
                ? { kind: "type", value: categoryToApiType[selectedCategory] }
                : undefined;
        const report = generateCatalogReport(localExercises);
        printCatalogReport(report, filter);
    }
    return (_jsxs("div", { className: "p-8 w-full h-full mt-7 animate-slide-up-fade", children: [_jsxs("div", { className: "flex flex-row justify-center items-center gap-4", children: [_jsx(SelectInput, { id: "category-filter", value: selectedCategory, onChange: handleCategoryChange, options: categoryOptions, placeholder: "Selecciona una categor\u00EDa", className: "bg-gray-900 border-none w-56" }), selectedCategory === "Fuerza" && (_jsx(SelectInput, { id: "muscle-filter", value: selectedMuscle, onChange: handleMuscleChange, options: muscleOptions, placeholder: "Selecciona un m\u00FAsculo", className: "bg-gray-900 border-none w-56" })), _jsx(BigTitle, { className: "text-center", children: "Cat\u00E1logo de ejercicios" })] }), isAdminUser && externalExercises.length > 0 && (_jsx("div", { className: "flex justify-start ml-26 mt-6", children: _jsx(Button, { type: "button", onClick: handleGenerateReport, className: "w-auto px-7 py-3  mt-0", children: "Generar reporte" }) })), _jsx("div", { className: "flex flex-col mt-6", children: _jsx(ExercisesCatalogField, { exercises: filteredLocalExercises }) }), isAdminUser && (_jsxs("div", { className: "flex flex-col mt-14", children: [_jsx(BigTitle, { className: "text-xl ml-26 self-start", children: "API Exercises" }), _jsx(ExercisesCatalogField, { exercises: externalExercises, error: error, loading: loading, onAdd: handleAddExternalExercise })] }))] }));
}
