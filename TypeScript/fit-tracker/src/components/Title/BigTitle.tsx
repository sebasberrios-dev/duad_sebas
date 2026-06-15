import React from "react";
import { JSX } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export const BigTitle = ({ children, className }: Props): JSX.Element => {
  return (
    <h1
      className={`text-3xl font-bold text-white self-center ${className ?? ""}`}
    >
      {children}
    </h1>
  );
};
