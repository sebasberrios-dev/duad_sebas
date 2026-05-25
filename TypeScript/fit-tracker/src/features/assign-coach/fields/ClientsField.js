import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { useUsers } from "../../../context/UserContext";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
export function ClientsField({ control, }) {
    const { users } = useUsers();
    const clientOptions = users.map((user) => ({
        id: String(user.id),
        displayName: user.name,
    }));
    return (_jsx(Controller, { name: "clientId", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "clientId", children: "Usuario" }), _jsx(SelectInput, { id: "clientId", value: String(field.value ?? ""), options: clientOptions, onChange: (val) => field.onChange(Number(val)), placeholder: "Seleccione el usuario" })] })) }));
}
