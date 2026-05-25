import { jsx as _jsx } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export default function Main({ className, children, }) {
    return (_jsx("main", { className: twMerge("flex-1 overflow-y-auto bg-gray-950", className), children: children }));
}
