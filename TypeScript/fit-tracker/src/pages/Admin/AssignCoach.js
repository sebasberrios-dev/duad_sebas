import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { ClientsField } from "../../features/assign-coach/fields/ClientsField";
import { CoachsField } from "../../features/assign-coach/fields/CoachsField";
import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import { assignCoachSchema, } from "../../features/assign-coach/schema/assignCoachSchema";
import { zodResolver } from "@hookform/resolvers/zod";
export default function AssignCoach() {
    const { findById, replace } = useUsers();
    const { currentUser, isAdmin, isCoach } = useSession();
    const navigate = useNavigate();
    const { control, handleSubmit, setError, reset } = useForm({
        resolver: zodResolver(assignCoachSchema),
    });
    useEffect(() => {
        if (!currentUser || !isAdmin(currentUser)) {
            navigate("/admin/login", { replace: true });
        }
    }, [currentUser]);
    if (!currentUser || !isAdmin(currentUser))
        return null;
    function onSubmit(data) {
        const found = findById(data.coachId);
        const coach = found && isCoach(found) ? found : undefined;
        const user = findById(data.clientId);
        if (!coach) {
            setError("coachId", { message: "Coach no encontrado" });
            return;
        }
        if (!user) {
            setError("clientId", { message: "Usuario no encontrado" });
            return;
        }
        const newClient = {
            id: user.id,
            clientName: user.name,
        };
        const updatedCoach = {
            ...coach,
            clients: [...coach.clients, newClient],
        };
        replace(updatedCoach);
        reset();
    }
    return (_jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), className: "bg-gray-850 shadow-2xl", children: [_jsx(FormTitle, { children: "Asignar Coach" }), _jsx(ClientsField, { control: control }), _jsx(CoachsField, { control: control }), _jsx(Button, { type: "submit", children: "Asignar" })] }));
}
