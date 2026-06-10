import { JSX } from "react";
import { twMerge } from "tailwind-merge";
import { GeneralProps } from "../general-props";

export const CardContainer = ({
  className,
  children,
}: GeneralProps): JSX.Element => {
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
