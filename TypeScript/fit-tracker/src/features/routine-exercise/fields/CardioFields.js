import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { fcmOptions } from "../types/options";
import TextInput from "../../../components/Form/Input/TextInput";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
export function DistanceField({ control, }) {
    return (_jsx(Controller, { name: "details.distanceKm", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "distanceKm", children: "Distancia (km)" }), _jsx(TextInput, { id: "distanceKm", type: "number", value: field.value ?? "", onChange: (v) => field.onChange(v === "" ? undefined : Number(v)), placeholder: "Ej: 5.5" })] })) }));
}
export function FCMField({ control }) {
    return (_jsx(Controller, { name: "details.fcm", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "fcm", children: "Zona de frecuencia card\u00EDaca" }), _jsx(SelectInput, { id: "fcm", value: field.value ?? "", options: fcmOptions, onChange: field.onChange, placeholder: "Seleccionar zona" })] })) }));
}
export default function CardioFields({ control, }) {
    return (_jsxs(_Fragment, { children: [_jsx("p", { className: "w-full text-xs font-semibold text-green-700 uppercase tracking-widest", children: "Detalles de Cardio" }), _jsx(DistanceField, { control: control }), _jsx(FCMField, { control: control })] }));
}
