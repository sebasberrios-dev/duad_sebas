import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUsers } from "../../../context/UserContext";
import { useSession } from "../../../context/SessionContext";
import { useForm } from "react-hook-form";
import { registerAdminSchema, } from "../../../features/auth/admin/schema/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterAdminFields from "../../../features/auth/admin/fields/RegisterAdminFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../../components/Form/FormSection";
import { FormContainer } from "../../../components/Container/FormContainer";
import { FormTitle } from "../../../components/Title/FormTitle";
import { Button } from "../../../components/Button/Button";
export default function RegisterAdmin() {
    const { addAdmin } = useUsers();
    const { login } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registerAdminSchema),
    });
    function onSubmit(data) {
        console.log("Registrando admin...");
        const newAdmin = {
            id: Date.now(),
            role: "Admin",
            ...data,
        };
        addAdmin(newAdmin);
        login(newAdmin.id);
        navigate("/dashboard");
    }
    return (_jsx(FormSection, { children: _jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), children: [_jsx(FormTitle, { children: "Registro de Admin" }), _jsx(RegisterAdminFields, { control: control }), _jsx(Button, { type: "submit", children: "Registrate" })] }) }));
}
