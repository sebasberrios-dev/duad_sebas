import { jsx as _jsx } from "react/jsx-runtime";
export default function TextInput({ id, type, value, onChange, placeholder, className, }) {
    return (_jsx("input", { id: id, type: type ?? "text", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: `w-full bg-gray-800 text-white placeholder:text-gray-500 rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className ?? ""}` }));
}
