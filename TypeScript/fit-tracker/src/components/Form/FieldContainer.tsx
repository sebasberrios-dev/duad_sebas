import { JSX } from "react";
import { GeneralProps } from "../general-props";

export const FieldContainer = ({
  children,
  className,
}: GeneralProps): JSX.Element => {
  return (
    <div className={`w-full flex flex-col gap-1 ${className ?? ""}`}>
      {children}
    </div>
  );
};
