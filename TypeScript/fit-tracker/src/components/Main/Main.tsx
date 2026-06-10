import { twMerge } from "tailwind-merge";
import { JSX } from "react";
import { GeneralProps } from "../general-props";

export default function Main({
  className,
  children,
}: GeneralProps): JSX.Element {
  return (
    <main className={twMerge("flex-1 overflow-y-auto bg-gray-950", className)}>
      {children}
    </main>
  );
}
