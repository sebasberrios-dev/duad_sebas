import React, { JSX } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const CardContainer = ({ className, children }: Props): JSX.Element => {
  return (
    <div
      className={twMerge(
        "bg-gray-900 rounded-xl p-7 flex flex-col gap-4 border border-gray-800 shadow-xl max-w-xs w-full",
        className,
      )}
    >
      {children}
    </div>
  );
};
