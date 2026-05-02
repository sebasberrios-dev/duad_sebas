import { JSX } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const FieldContainer = ({ children, className }: Props): JSX.Element => {
  return (
    <div className={`w-full flex flex-col gap-1 ${className ?? ""}`}>
      {children}
    </div>
  );
};
