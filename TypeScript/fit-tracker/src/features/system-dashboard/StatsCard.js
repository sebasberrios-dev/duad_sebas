import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CardContainer } from "../../components/Container/CardContainer";
export function StatsCard({ title, value, detail }) {
    return (_jsxs(CardContainer, { className: "gap-2", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase tracking-wide", children: title }), _jsx("p", { className: "text-3xl font-bold", children: value }), _jsx("p", { className: "text-xs text-gray-500", children: detail })] }));
}
