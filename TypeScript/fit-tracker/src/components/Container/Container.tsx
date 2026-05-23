import { JSX } from "react";
import { twMerge } from "tailwind-merge";
import { GeneralProps } from "../general-props";

export const Container = ({
  children,
  className,
}: GeneralProps): JSX.Element => {
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
