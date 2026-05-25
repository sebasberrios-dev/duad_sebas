import { jsx as _jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export const FormContainer = ({ children, onSubmit, className, }) => {
    return (_jsx("form", { onSubmit: onSubmit, className: twMerge("text-white bg-gray-950 flex flex-col items-center gap-8 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade", className), children: children }));
};
