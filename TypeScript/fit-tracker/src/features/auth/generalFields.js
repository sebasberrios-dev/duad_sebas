import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { FieldContainer } from "../../components/Form/FieldContainer";
import { FormLabel } from "../../components/Form/FormLabel";
import TextInput from "../../components/Form/Input/TextInput";
export function NameField({ control, }) {
    return (_jsx(Controller, { name: "name", control: control, render: ({ field, fieldState }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "name", children: _jsx(TextInput, { id: "name", type: "text", value: field.value ?? "", onChange: field.onChange, placeholder: "Nombre" }) }), fieldState.error && (_jsx("p", { className: "text-red-500 text-xs", children: fieldState.error.message }))] })) }));
}
export function AgeField({ control, }) {
    return (_jsx(Controller, { name: "age", control: control, render: ({ field, fieldState }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "age", children: _jsx(TextInput, { id: "age", type: "number", value: field.value ?? "", onChange: (v) => field.onChange(v === "" ? undefined : Number(v)), placeholder: "Edad" }) }), fieldState.error && (_jsx("p", { className: "text-red-500 text-xs", children: fieldState.error.message }))] })) }));
}
export function EmailField({ control, }) {
    return (_jsx(Controller, { name: "email", control: control, render: ({ field, fieldState }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "email", children: _jsx(TextInput, { id: "email", type: "email", value: field.value ?? "", onChange: field.onChange, placeholder: "Correo Electr\u00F3nico" }) }), fieldState.error && (_jsx("p", { className: "text-red-500 text-xs", children: fieldState.error.message }))] })) }));
}
