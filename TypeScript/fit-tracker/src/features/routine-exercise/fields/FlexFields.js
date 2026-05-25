import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";
export default function FlexFields({ control, }) {
    return (_jsxs(_Fragment, { children: [_jsx("p", { className: "w-full text-xs font-semibold text-green-700 uppercase tracking-widest", children: "Detalles de Flexibilidad" }), _jsx(Controller, { name: "details.poses", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "poses", children: "N\u00FAmero de poses" }), _jsx(TextInput, { id: "poses", type: "number", value: field.value ?? "", onChange: (v) => field.onChange(v === "" ? undefined : Number(v)), placeholder: "Ej: 10" })] })) })] }));
}
