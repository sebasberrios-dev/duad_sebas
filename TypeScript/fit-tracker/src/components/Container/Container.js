import { jsx as _jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export const Container = ({ children, className, }) => {
    return (_jsx("div", { className: twMerge("text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md boder-gray-800 animate-slide-up-fade", className), children: children }));
};
