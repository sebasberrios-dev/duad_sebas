import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { statusOptions } from "../types/options";
export default function CompleteField({ control, }) {
    return (_jsx(Controller, { name: "status", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "status", children: "Estado de entrenamiento" }), _jsx(SelectInput, { id: "status", value: field.value ?? "", options: statusOptions, onChange: field.onChange, placeholder: "Seleccionar estado" })] })) }));
}
