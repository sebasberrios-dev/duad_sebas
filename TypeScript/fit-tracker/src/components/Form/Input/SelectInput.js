import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
export default function SelectInput({ id, value, onChange, options, placeholder, className, }) {
    return (_jsxs("select", { id: id, value: value, className: twMerge("w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition ", className), onChange: (e) => onChange(e.target.value), children: [placeholder && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((option) => (_jsx("option", { value: option.id, className: option.className, children: option.displayName }, option.id)))] }));
}
