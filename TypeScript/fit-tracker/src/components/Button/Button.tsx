import React from "react";
import { JSX } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  type: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  className?: string;
}

export const Button = ({
  children,
  type,
  onClick,
  className,
}: Props): JSX.Element => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer mt-2",
        className,
      )}
    >
      {children}
    </button>
  );
};
