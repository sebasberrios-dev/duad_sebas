import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { DAYS_LIST } from "../../../types/types";
import { Button } from "../../../components/Button/Button";
import TextInput from "../../../components/Form/Input/TextInput";
export default function DaysField({ draft, draftComments, onClick, onCommentChange, }) {
    return (_jsx("div", { className: "w-full grid grid-cols-2 gap-3", children: DAYS_LIST.map((day) => (_jsxs("div", { children: [_jsxs(Button, { type: "button", onClick: () => onClick(day), className: "bg-mist-600 hover:bg-mist-800 active:bg-mist-900", children: [day, " ", draft[day]?.length ? `(${draft[day].length})` : ""] }), draft[day]?.map((ex) => (_jsx("p", { className: "text-xs text-gray-400 px-1 py-1", children: `${ex.exerciseName}` }, ex.id))), (draft[day]?.length ?? 0) > 0 && (_jsx(TextInput, { id: `comment-${day}`, type: "text", value: draftComments[day] ?? "", onChange: (v) => onCommentChange(day, v), placeholder: `Comentario de la sesión (${day})` }))] }, day))) }));
}
