import { JSX } from "react";
import { FormLabelProps } from "./form-props";

export const FormLabel = ({
  children,
  className,
  htmlFor,
}: FormLabelProps): JSX.Element => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm text-gray-400 ${className ?? ""}`}
    >
      {children}
    </label>
  );
};
