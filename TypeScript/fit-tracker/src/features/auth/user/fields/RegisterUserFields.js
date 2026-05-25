import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import TextInput from "../../../../components/Form/Input/TextInput";
import SelectInput from "../../../../components/Form/Input/SelectInput";
import { AgeField, EmailField, NameField } from "../../generalFields";
const levelOptions = [
    { id: "Principiante", displayName: "Principiante" },
    { id: "Intermedio", displayName: "Intermedio" },
    { id: "Avanzado", displayName: "Avanzado" },
];
const planOptions = [
    { id: "Free", displayName: "Free" },
    { id: "Premium", displayName: "Premium" },
];
export function BodyWeightField({ control, }) {
    return (_jsx(Controller, { name: "bodyWeight", control: control, render: ({ field }) => (_jsx("div", { className: "w-full flex flex-col gap-1", children: _jsx("label", { htmlFor: "age", className: "text-sm text-gray-400", children: _jsx(TextInput, { id: "bodyWeight", type: "number", value: field.value ?? "", onChange: (v) => field.onChange(v === "" ? undefined : Number(v)), placeholder: "Peso corporal (kg)" }) }) })) }));
}
export function LevelField({ control, }) {
    return (_jsx(Controller, { name: "level", control: control, render: ({ field }) => (_jsx("div", { className: "w-full flex flex-col gap-1", children: _jsx("label", { htmlFor: "level", className: "text-sm text-gray-400", children: _jsx(SelectInput, { id: "level", value: field.value ?? "", onChange: field.onChange, options: levelOptions, placeholder: "Seleccione su nivel" }) }) })) }));
}
export function MembershipField({ control, }) {
    return (_jsx(Controller, { name: "membership.plan", control: control, render: ({ field }) => (_jsx("div", { className: "w-full flex flex-col gap-1", children: _jsx("label", { htmlFor: "plan", className: "text-sm text-gray-400", children: _jsx(SelectInput, { id: "plan", value: field.value ?? "", onChange: field.onChange, options: planOptions, placeholder: "Seleccione su plan" }) }) })) }));
}
export default function RegisterUserFields({ control, }) {
    return (_jsxs(_Fragment, { children: [_jsx(NameField, { control: control }), _jsx(AgeField, { control: control }), _jsx(EmailField, { control: control }), _jsx(BodyWeightField, { control: control }), _jsx(LevelField, { control: control }), _jsx("p", { className: "w-full text-xs font-semibold text-green-700 uppercase tracking-widest", children: "Membres\u00EDa" }), _jsx(MembershipField, { control: control })] }));
}
