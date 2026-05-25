import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { NameField, AgeField, EmailField } from "../../generalFields";
export default function RegisterAdminFields({ control, }) {
    return (_jsxs(_Fragment, { children: [_jsx(NameField, { control: control }), _jsx(AgeField, { control: control }), _jsx(EmailField, { control: control })] }));
}
