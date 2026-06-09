import { JSX } from "react";
import { useNavigate } from "react-router";
import { useSession } from "../context/SessionContext";
import {
  IconMyClients,
  IconAssign,
  IconCatalog,
  IconChevron,
  IconLogout,
  IconMyRoutines,
  IconRoutine,
  IconSystem,
} from "../features/sidebar/icons";
import { NavItem } from "../features/sidebar/NavItem";
import { AppUser } from "../types/interfaces";
import { SidebarProps } from "../features/sidebar/props/sidebar-props";

function formatRole(role: AppUser["role"]): string {
  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case "user":
      return "Usuario";
    case "coach":
      return "Coach";
    case "admin":
      return "Administrador";

    default:
      return "Desconocido";
  }
}

export function Sidebar({ collapsed, onToggle }: SidebarProps): JSX.Element {
  const { currentUser, logout } = useSession();
  const navigate = useNavigate();
  const role = currentUser?.role ?? null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside
      className={`flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300  ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Brand + toggle */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-gray-800">
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          <img
            src="/fitness-svgrepo-com.svg"
            alt="FitTracker logo"
            className="h-7 w-7 "
          />
          <span className="font-bold text-base tracking-wide whitespace-nowrap">
            FitTracker
          </span>
        </div>

        {collapsed && (
          <img
            src="/fitness-svgrepo-com.svg"
            alt="FitTracker logo"
            className="h-7 w-7 mx-auto"
          />
        )}

        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors duration-150 p-1 rounded cursor-pointer shrink-0"
          aria-label="Toggle sidebar"
        >
          <IconChevron collapsed={collapsed} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
        {role === "User" && (
          <>
            <NavItem
              to="/dashboard/routine"
              icon={<IconRoutine />}
              label="Registrar rutina"
              collapsed={collapsed}
            />
            <NavItem
              to="/dashboard/my_routines"
              icon={<IconMyRoutines />}
              label="Ver mis rutinas"
              collapsed={collapsed}
            />
          </>
        )}

        {role === "Admin" && (
          <>
            <NavItem
              to="/dashboard"
              icon={<IconSystem />}
              label="Sistema"
              collapsed={collapsed}
              end
            />
            <NavItem
              to="/dashboard/admin/assign_coach"
              icon={<IconAssign />}
              label="Asignar Coach"
              collapsed={collapsed}
            />
            <NavItem
              to="/dashboard/admin/register_exercise"
              icon={<IconRoutine />}
              label="Añadir ejercicio"
              collapsed={collapsed}
            />
            <NavItem
              to="/dashboard/catalog"
              icon={<IconCatalog />}
              label="Catálogo"
              collapsed={collapsed}
            />
          </>
        )}

        {role === "Coach" && (
          <>
            <NavItem
              to="/dashboard/coach/my_clients"
              icon={<IconMyClients />}
              label="Mis clientes"
              collapsed={collapsed}
            />
            <NavItem
              to="/dashboard/catalog"
              icon={<IconCatalog />}
              label="Catálogo"
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-gray-800 px-2 py-3 flex flex-col gap-1">
        {!collapsed && currentUser && (
          <div className="px-3 py-2 flex flex-col gap-1">
            <p className="text-xs text-gray-500 truncate">{currentUser.name}</p>
            <p className="text-xs text-green-500 font-medium">
              {formatRole(currentUser.role)}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Cerrar sesión" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors duration-150 w-full cursor-pointer"
        >
          <IconLogout />
          <span
            className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  );
}
