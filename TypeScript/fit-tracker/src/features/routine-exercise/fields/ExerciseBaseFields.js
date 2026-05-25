import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";
export default function ExerciseBaseFields({ control, }) {
    return (_jsx(Controller, { name: "durationMinutes", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "durationMinutes", children: "Duraci\u00F3n (minutos)" }), _jsx(TextInput, { id: "durationMinutes", type: "number", value: field.value ?? "", onChange: (v) => field.onChange(v === "" ? undefined : Number(v)), placeholder: "Ej: 45" })] })) }));
}
