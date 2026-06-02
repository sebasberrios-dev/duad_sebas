import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import { registerCoachSchema, } from "../../features/auth/coach/schema/coachSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterCoachFields from "../../features/auth/coach/fields/RegisterCoachFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { genUniqueId } from "../../utils/utilities";
export default function RegisterCoach() {
    const { add } = useUsers();
    const { login } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registerCoachSchema),
    });
    function onSubmit(data) {
        const newCoach = {
            id: genUniqueId(),
            role: "Coach",
            ...data,
            clients: [],
        };
        add(newCoach);
        login(newCoach.id);
        navigate("/dashboard");
    }
    return (_jsx(FormSection, { children: _jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), children: [_jsx(FormTitle, { children: "Registro de Coach" }), _jsx(RegisterCoachFields, { control: control }), _jsx(Button, { type: "submit", children: "Registrate" })] }) }));
}
