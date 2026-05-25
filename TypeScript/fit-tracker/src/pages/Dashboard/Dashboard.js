import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../../static/Sidebar";
import Main from "../../components/Main/Main";
export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false);
    return (_jsxs("div", { className: "flex h-screen bg-gray-950 text-white overflow-hidden", children: [_jsx(Sidebar, { collapsed: collapsed, onToggle: () => setCollapsed((prev) => !prev) }), _jsx(Main, { className: "flex items-center justify-center bg-gray-900", children: _jsx(Outlet, {}) })] }));
}
