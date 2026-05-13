import { twMerge } from "tailwind-merge";
import React, { JSX } from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function Main({ className, children }: Props): JSX.Element {
  return (
    <main className={twMerge("flex-1 overflow-y-auto bg-gray-950", className)}>
      {children}
    </main>
  );
}
