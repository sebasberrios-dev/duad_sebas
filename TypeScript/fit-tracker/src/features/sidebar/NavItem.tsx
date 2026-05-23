import { JSX } from "react";
import { NavLink } from "react-router";
import { NavItemProps } from "./props/nav-item-props";

export function NavItem({
  to,
  icon,
  label,
  collapsed,
}: NavItemProps): JSX.Element {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
          isActive
            ? "bg-green-900/40 text-green-400"
            : "text-gray-400 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      <span
        className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}
