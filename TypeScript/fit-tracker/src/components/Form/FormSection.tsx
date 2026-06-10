import { JSX } from "react";
import { twMerge } from "tailwind-merge";
import { GeneralProps } from "../general-props";

export const FormSection = ({
  children,
  className,
}: GeneralProps): JSX.Element => {
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
