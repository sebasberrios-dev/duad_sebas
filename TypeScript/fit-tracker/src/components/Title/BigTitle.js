import { jsx as _jsx } from "react/jsx-runtime";
export const BigTitle = ({ children, className }) => {
    return (_jsx("h1", { className: `text-3xl font-bold text-white self-center ${className ?? ""}`, children: children }));
};
