import React from "react";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  onSubmit?: () => void;
  className?: string;
}

export const FormContainer = ({
  children,
  onSubmit,
  className,
}: Props): JSX.Element => {
  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(
        "text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade",
        className,
      )}
    >
      {children}
    </form>
  );
};
