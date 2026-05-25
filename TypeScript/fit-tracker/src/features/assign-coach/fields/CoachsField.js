import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { useUsers } from "../../../context/UserContext";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
export function CoachsField({ control, }) {
    const { coachs } = useUsers();
    const coachsOptions = coachs.map((coach) => ({
        id: String(coach.id),
        displayName: coach.name,
    }));
    return (_jsx(Controller, { name: "coachId", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "coachId", children: "Coach" }), _jsx(SelectInput, { id: "coachId", value: String(field.value ?? ""), options: coachsOptions, onChange: (val) => field.onChange(Number(val)), placeholder: "Seleccione el coach" })] })) }));
}
