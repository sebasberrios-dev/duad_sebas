import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router";
const navItems = [
    { label: "Catálogo", to: "/dashboard/catalog" },
    { label: "Añadir ejercicio", to: "/dashboard/admin/register_exercise" },
    { label: "Asignar coach", to: "/dashboard/admin/assign_coach" },
    { label: "Registrar rutina", to: "/dashboard/routine" },
    { label: "Mis clientes", to: "/dashboard/coach/my_clients" },
];
export function QuickNav() {
    const navigate = useNavigate();
    return (_jsx("div", { className: "flex flex-wrap gap-3", children: navItems.map((item) => (_jsx("button", { onClick: () => navigate(item.to), className: "px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition cursor-pointer", children: item.label }, item.to))) }));
}
