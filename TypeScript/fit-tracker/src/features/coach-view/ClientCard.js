import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../../components/Button/Button";
import { CardContainer } from "../../components/Container/CardContainer";
import { printClientsInfo } from "../../utils/console";
export function ClientCard({ client, users }) {
    return (_jsxs(CardContainer, { children: [_jsx("p", { className: "text-lg font-semibold text-white truncate", children: client.clientName }), _jsx(Button, { type: "button", onClick: () => printClientsInfo(users, client.id), children: "Ver info" })] }));
}
