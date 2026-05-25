import { jsx as _jsx } from "react/jsx-runtime";
export const FormLabel = ({ children, className, htmlFor, }) => {
    return (_jsx("label", { htmlFor: htmlFor, className: `text-sm text-gray-400 ${className ?? ""}`, children: children }));
};
