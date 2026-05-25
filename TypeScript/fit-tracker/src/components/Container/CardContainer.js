import { jsx as _jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export const CardContainer = ({ className, children, }) => {
    return (_jsx("div", { className: twMerge("bg-gray-900 rounded-xl p-7 flex flex-col gap-4 border border-gray-800 shadow-xl max-w-xs w-full", className), children: children }));
};
