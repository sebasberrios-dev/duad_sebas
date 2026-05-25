import { jsx as _jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export const FormSection = ({ children, className, }) => {
    return (_jsx("section", { className: twMerge("bg-linear-to-bl from-black to-green-900 min-h-dvh grid place-items-center px-4", className), children: children }));
};
