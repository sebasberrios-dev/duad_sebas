import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { loginCoachSchema, } from "../../features/auth/coach/schema/coachSchema";
import LoginCoachFields from "../../features/auth/coach/fields/LoginCoachFields";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
export default function LoginCoach() {
    const { coachs } = useUsers();
    const { login } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(loginCoachSchema),
    });
    function onSubmit(data) {
        const coach = coachs.find((u) => u.email.toLowerCase() === data.email.toLocaleLowerCase());
        if (!coach) {
            setError("email", { message: "Coach no encontrado" });
            return;
        }
        login(coach.id);
        navigate("/dashboard");
    }
    return (_jsx(FormSection, { children: _jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), children: [_jsx(FormTitle, { children: "Iniciar Sesi\u00F3n" }), _jsx(LoginCoachFields, { control: control }), _jsx(Button, { type: "submit", children: "Ingresar" })] }) }));
}
