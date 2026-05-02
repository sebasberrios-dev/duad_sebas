import React from "react";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({ children, className }: Props): JSX.Element => {
  return (
    <section
      className={twMerge(
        "bg-linear-to-bl from-black to-green-900 min-h-dvh grid place-items-center px-4",
        className,
      )}
    >
      {children}
    </section>
  );
};
