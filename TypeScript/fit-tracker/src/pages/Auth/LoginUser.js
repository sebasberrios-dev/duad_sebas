import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUserSchema, } from "../../features/auth/user/schema/userSchema";
import LoginUserFields from "../../features/auth/user/fields/LoginUserFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { AuthRedirectLink } from "../../components/Form/AuthRedirectLink";
export default function LoginUser() {
    const { users } = useUsers();
    const { login } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(loginUserSchema),
    });
    function onSubmit(data) {
        const user = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
        if (!user) {
            setError("email", { message: "Usuario no encontrado" });
            return;
        }
        login(user.id);
        navigate("/dashboard");
    }
    return (_jsx(FormSection, { children: _jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), children: [_jsx(FormTitle, { children: "Iniciar Sesi\u00F3n" }), _jsx(LoginUserFields, { control: control }), _jsx(Button, { type: "submit", children: "Ingresar" }), _jsx(AuthRedirectLink, { prompt: "\u00BFNo te has registrado?", linkText: "Registrate", onClick: () => navigate("/register") })] }) }));
}
