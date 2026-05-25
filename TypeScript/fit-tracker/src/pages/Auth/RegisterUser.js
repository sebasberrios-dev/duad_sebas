import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import { registerUserSchema, } from "../../features/auth/user/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterUserFields from "../../features/auth/user/fields/RegisterUserFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { AuthRedirectLink } from "../../components/Form/AuthRedirectLink";
export default function RegisterUser() {
    const { addUser } = useUsers();
    const { login } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registerUserSchema),
    });
    function onSubmit(data) {
        console.log("Registrando usuario...");
        const newUser = {
            id: Date.now(),
            role: "User",
            ...data,
            membership: {
                id: Date.now() + 1,
                ...data.membership,
                status: "active",
                startDate: new Date().toISOString(),
            },
            routine: {
                id: Date.now() + 2,
                routineName: "",
                routineStartDate: "",
                workouts: [],
            },
        };
        addUser(newUser);
        login(newUser.id);
        navigate("/dashboard");
    }
    return (_jsx(FormSection, { children: _jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), children: [_jsx(FormTitle, { children: "Registro" }), _jsx(RegisterUserFields, { control: control }), _jsx(Button, { type: "submit", children: "Registrarse" }), _jsx(AuthRedirectLink, { prompt: "\u00BFYa tienes una cuenta?", linkText: "Ingresa a tu cuenta", onClick: () => navigate("/login") })] }) }));
}
