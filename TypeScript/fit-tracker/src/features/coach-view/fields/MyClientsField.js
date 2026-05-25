import { jsx as _jsx } from "react/jsx-runtime";
import { ClientCard } from "../ClientCard";
export function MyClientsField({ clients, users }) {
    if (clients.length === 0) {
        return _jsx("p", { className: "text-gray-500", children: "No tienes clientes" });
    }
    return (_jsx("div", { className: "grid grid-cols-3 gap-4 w-full mt-9 ml-8", children: clients.map((client) => (_jsx(ClientCard, { client: client, users: users }, client.id))) }));
}
