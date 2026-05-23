import { JSX } from "react";
import { twMerge } from "tailwind-merge";
import { FormContainerProps } from "./props/form-container-props";

export const FormContainer = ({
  children,
  onSubmit,
  className,
}: FormContainerProps): JSX.Element => {
  return (
    <form
      onSubmit={onSubmit}
      className={twMerge(
        "text-white bg-gray-950 flex flex-col items-center gap-8 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade",
        className,
      )}
    >
      {children}
    </form>
  );
};
