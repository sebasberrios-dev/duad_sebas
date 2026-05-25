import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUsers } from "../../../context/UserContext";
import { useSession } from "../../../context/SessionContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { loginAdminSchema, } from "../../../features/auth/admin/schema/adminSchema";
import LoginAdminFields from "../../../features/auth/admin/fields/LoginAdminFields";
import { FormSection } from "../../../components/Form/FormSection";
import { FormContainer } from "../../../components/Container/FormContainer";
import { FormTitle } from "../../../components/Title/FormTitle";
import { Button } from "../../../components/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
export default function LoginAdmin() {
    const { admins } = useUsers();
    const { login } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(loginAdminSchema),
    });
    function onSubmit(data) {
        const admin = admins.find((a) => a.email.toLowerCase() === data.email.toLocaleLowerCase());
        if (!admin) {
            setError("email", { message: "Admin no encontrado" });
            return;
        }
        login(admin.id);
        navigate("/dashboard");
    }
    return (_jsx(FormSection, { children: _jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), children: [_jsx(FormTitle, { children: "Iniciar Sesi\u00F3n" }), _jsx(LoginAdminFields, { control: control }), _jsx(Button, { type: "submit", children: "Ingresar" })] }) }));
}
