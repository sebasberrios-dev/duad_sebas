import { jsx as _jsx } from "react/jsx-runtime";
export const FormTitle = ({ children, className }) => {
    return (_jsx("h2", { className: `text-2xl font-bold text-white self-center ${className ?? ""}`, children: children }));
};
