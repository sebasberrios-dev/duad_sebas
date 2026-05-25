import { jsx as _jsx } from "react/jsx-runtime";
import { createPortal } from "react-dom";
export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen)
        return null;
    return createPortal(_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70", onClick: onClose, children: _jsx("div", { className: "bg-gray-950 rounded-2xl p-6 w-full max-w-md border border-gray-800", onClick: (e) => e.stopPropagation(), children: children }) }), document.body);
}
