import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Controller, useWatch } from "react-hook-form";
import SelectInput from "../../../components/Form/Input/SelectInput";
import TextInput from "../../../components/Form/Input/TextInput";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import { muscleOptions as catalogOptions, categoryOptions, } from "../types/options";
export function ExerciseNameField({ control, }) {
    return (_jsx(Controller, { name: "exerciseName", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "exerciseName", children: "Nombre del ejercicio" }), _jsx(TextInput, { id: "exerciseName", value: field.value ?? "", onChange: field.onChange, placeholder: "Ej: Press de banca" })] })) }));
}
export function MuscleField({ control, }) {
    return (_jsx(Controller, { name: "muscle", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "muscle", children: "M\u00FAsculo" }), _jsx(SelectInput, { id: "muscle", value: field.value ?? "", options: catalogOptions, onChange: field.onChange, placeholder: "Seleccionar m\u00FAsculo" })] })) }));
}
export function CategoryField({ control, }) {
    return (_jsx(Controller, { name: "category", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "category", children: "Categor\u00EDa" }), _jsx(SelectInput, { id: "category", value: field.value ?? "", options: categoryOptions, onChange: field.onChange, placeholder: "Seleccionar categor\u00EDa" })] })) }));
}
export function DescriptionField({ control, }) {
    return (_jsx(Controller, { name: "description", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "description", children: "Descripci\u00F3n" }), _jsx(TextInput, { id: "description", value: field.value ?? "", onChange: field.onChange, placeholder: "Ej: Ejercicio compuesto para pecho y tr\u00EDceps" })] })) }));
}
export default function RegisterCatalogExerciseFields({ control, }) {
    const category = useWatch({ control, name: "category" });
    return (_jsxs(_Fragment, { children: [_jsx(ExerciseNameField, { control: control }), _jsx(CategoryField, { control: control }), category === "Fuerza" && _jsx(MuscleField, { control: control }), _jsx(DescriptionField, { control: control })] }));
}
