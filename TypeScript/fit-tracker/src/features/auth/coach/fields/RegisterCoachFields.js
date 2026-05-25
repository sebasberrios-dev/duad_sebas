import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { NameField, AgeField, EmailField } from "../../generalFields";
import SelectInput from "../../../../components/Form/Input/SelectInput";
import { FieldContainer } from "../../../../components/Form/FieldContainer";
import { FormLabel } from "../../../../components/Form/FormLabel";
const experienceOptions = [
    { id: "junior", displayName: "Junior" },
    { id: "intermediate", displayName: "Intermedio" },
    { id: "senior", displayName: "Senior" },
    { id: "expert", displayName: "Experto" },
];
export function CoachExperienceField({ control, }) {
    return (_jsx(Controller, { name: "experience", control: control, render: ({ field }) => (_jsx(FieldContainer, { children: _jsx(FormLabel, { htmlFor: "experience", children: _jsx(SelectInput, { id: "experience", value: field.value ?? "", onChange: field.onChange, options: experienceOptions, placeholder: "Seleccione su experiencia como coach" }) }) })) }));
}
export default function RegisterCoachFields({ control, }) {
    return (_jsxs(_Fragment, { children: [_jsx(NameField, { control: control }), _jsx(AgeField, { control: control }), _jsx(EmailField, { control: control }), _jsx(CoachExperienceField, { control: control })] }));
}
