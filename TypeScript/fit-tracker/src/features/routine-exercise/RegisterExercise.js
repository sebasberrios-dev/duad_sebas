import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { exerciseSchema } from "./schema/exerciseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CardioFields from "./fields/CardioFields";
import StrengthFields from "./fields/StrengthFields";
import FlexFields from "./fields/FlexFields";
import ExerciseBaseFields from "./fields/ExerciseBaseFields";
import { useCatalog } from "../../context/CatalogContext";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import RegisterExerciseFields from "./fields/RegisterExerciseFields";
import { Button } from "../../components/Button/Button";
import CompleteField from "./fields/CompleteField";
export default function RegisterExercise({ day, preloaded, onSuccess }) {
    const { catalog } = useCatalog();
    const catalogOptions = catalog.map((e) => ({
        id: String(e.id),
        displayName: e.exerciseName,
    }));
    const { control, handleSubmit, watch, setValue, reset } = useForm({
        resolver: zodResolver(exerciseSchema),
        defaultValues: preloaded
            ? {
                catalogExerciseId: preloaded.id,
                exerciseName: preloaded.exerciseName,
                category: preloaded.category,
                status: "pending",
            }
            : undefined,
    });
    const category = watch("category");
    function onSubmit(data) {
        let details;
        if (data.category === "Cardio") {
            details = { category: "Cardio", ...data.details };
        }
        else if (data.category === "Fuerza") {
            details = { category: "Fuerza", ...data.details };
        }
        else {
            details = { category: "Flexibilidad", ...data.details };
        }
        const newExercise = {
            id: Date.now(),
            exerciseName: data.exerciseName,
            durationMinutes: data.durationMinutes,
            status: data.status,
            details,
        };
        onSuccess(newExercise);
        reset();
    }
    function handleRest() {
        const restExercise = {
            id: Date.now(),
            exerciseName: "Descanso",
            durationMinutes: 0,
            status: "pending",
            details: { category: "Descanso" },
        };
        onSuccess(restExercise);
        reset();
    }
    return (_jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), className: "border-0", children: [_jsx(FormTitle, { children: preloaded ? preloaded.exerciseName : `Sesión de ${day.toLowerCase()}` }), !preloaded && (_jsx(RegisterExerciseFields, { control: control, catalogOptions: catalogOptions, setValue: setValue })), _jsx(ExerciseBaseFields, { control: control }), category === "Cardio" && _jsx(CardioFields, { control: control }), category === "Fuerza" && _jsx(StrengthFields, { control: control }), category === "Flexibilidad" && _jsx(FlexFields, { control: control }), _jsx(CompleteField, { control: control }), _jsx(Button, { type: "submit", children: "Guardar ejercicio" }), !preloaded && (_jsx(Button, { type: "button", onClick: handleRest, className: "bg-red-700 hover:bg-red-600 active:bg-red-800", children: "Marcar como descanso" }))] }));
}
