import { JSX } from "react";

export interface NavItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  collapsed: boolean;
}
