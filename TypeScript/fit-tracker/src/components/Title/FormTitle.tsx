import React from "react";
import { JSX } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export const FormTitle = ({ children, className }: Props): JSX.Element => {
  return (
    <h2
      className={`text-2xl font-bold text-white self-center ${className ?? ""}`}
    >
      {children}
    </h2>
  );
};
