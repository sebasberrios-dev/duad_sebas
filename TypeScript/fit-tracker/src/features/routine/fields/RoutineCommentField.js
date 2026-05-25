import { jsx as _jsx } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import TextInput from "../../../components/Form/Input/TextInput";
export default function RoutineCommentField({ control, }) {
    return (_jsx(Controller, { name: "routineComment", control: control, render: ({ field }) => (_jsx(FieldContainer, { children: _jsx(FormLabel, { htmlFor: "routineComment", children: _jsx(TextInput, { id: "routineComment", type: "text", value: field.value ?? "", onChange: field.onChange, placeholder: "Comentario de la rutina (opcional)" }) }) })) }));
}
