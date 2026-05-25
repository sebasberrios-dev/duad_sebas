import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { BigTitle } from "../../components/Title/BigTitle";
import { MyClientsField } from "../../features/coach-view/fields/MyClientsField";
import { useUsers } from "../../context/UserContext";
export default function CoachView() {
    const { users } = useUsers();
    const { currentUser } = useSession();
    const navigate = useNavigate();
    if (!currentUser) {
        alert("No hay sesión");
        navigate("login/coach");
        return;
    }
    if (currentUser?.role !== "Coach") {
        alert("No eres coach! Redirigiendo...");
        navigate("login");
        return;
    }
    const clients = currentUser.clients;
    return (_jsxs("div", { className: "p-8 w-full h-full mt-7 animate-slide-up-fade", children: [_jsx(BigTitle, { className: "text-center", children: "Mis clientes" }), _jsx(MyClientsField, { clients: clients, users: users })] }));
}
