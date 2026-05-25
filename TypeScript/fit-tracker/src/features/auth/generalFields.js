import { jsx as _jsx } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { FieldContainer } from "../../components/Form/FieldContainer";
import { FormLabel } from "../../components/Form/FormLabel";
import TextInput from "../../components/Form/Input/TextInput";
export function NameField({ control, }) {
    return (_jsx(Controller, { name: "name", control: control, render: ({ field }) => (_jsx(FieldContainer, { children: _jsx(FormLabel, { htmlFor: "name", children: _jsx(TextInput, { id: "name", type: "text", value: field.value ?? "", onChange: field.onChange, placeholder: "Nombre" }) }) })) }));
}
export function AgeField({ control, }) {
    return (_jsx(Controller, { name: "age", control: control, render: ({ field }) => (_jsx(FieldContainer, { children: _jsx(FormLabel, { htmlFor: "age", children: _jsx(TextInput, { id: "age", type: "number", value: field.value ?? "", onChange: (v) => field.onChange(v === "" ? undefined : Number(v)), placeholder: "Edad" }) }) })) }));
}
export function EmailField({ control, }) {
    return (_jsx(Controller, { name: "email", control: control, render: ({ field }) => (_jsx(FieldContainer, { children: _jsx(FormLabel, { htmlFor: "email", children: _jsx(TextInput, { id: "email", type: "email", value: field.value ?? "", onChange: field.onChange, placeholder: "Correo Electr\u00F3nico" }) }) })) }));
}
