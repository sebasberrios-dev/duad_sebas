import React, { JSX } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        "text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md boder-gray-800 animate-slide-up-fade",
        className,
      )}
    >
      {children}
    </div>
  );
};
