import { jsx as _jsx } from "react/jsx-runtime";
export const FieldContainer = ({ children, className, }) => {
    return (_jsx("div", { className: `w-full flex flex-col gap-1 ${className ?? ""}`, children: children }));
};
