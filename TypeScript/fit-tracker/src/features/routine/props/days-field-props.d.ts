import { Days, DraftRoutine } from "../../../types/types";
export interface DaysFieldProps {
    draft: DraftRoutine;
    draftComments: Partial<Record<Days, string>>;
    onClick: (day: Days) => void;
    onCommentChange: (day: Days, value: string) => void;
}
