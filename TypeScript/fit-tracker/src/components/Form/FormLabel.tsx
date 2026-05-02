import { JSX } from "react";

interface Props {
  children: React.ReactNode;
  htmlFor: string;
  className?: string;
}

export const FormLabel = ({
  children,
  className,
  htmlFor,
}: Props): JSX.Element => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm text-gray-400 ${className ?? ""}`}
    >
      {children}
    </label>
  );
};
