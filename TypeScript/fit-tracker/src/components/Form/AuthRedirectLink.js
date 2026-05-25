import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AuthRedirectLink({ prompt, linkText, onClick, }) {
    return (_jsxs("div", { className: "flex flex-row gap-2", children: [_jsx("span", { children: prompt }), _jsx("button", { type: "button", onClick: onClick, className: "text-violet-300 underline cursor-pointer", children: linkText })] }));
}
