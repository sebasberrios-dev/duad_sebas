import { jsx as _jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export const Button = ({ children, type, onClick, className, }) => {
    return (_jsx("button", { type: type, onClick: onClick, className: twMerge("w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer mt-2", className), children: children }));
};
