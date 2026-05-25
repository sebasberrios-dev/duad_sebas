import { jsx as _jsx } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import TextInput from "../../../components/Form/Input/TextInput";
export default function RoutineNameField({ control, }) {
    return (_jsx(Controller, { name: "routineName", control: control, render: ({ field }) => (_jsx(FieldContainer, { children: _jsx(FormLabel, { htmlFor: "routineName", children: _jsx(TextInput, { id: "routineName", type: "text", value: field.value ?? "", onChange: field.onChange, placeholder: "Nombre de la rutina" }) }) })) }));
}
