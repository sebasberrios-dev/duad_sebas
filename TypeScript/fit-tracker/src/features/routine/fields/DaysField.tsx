import { Days, DAYS_LIST, DraftRoutine } from "../../../types/types";
import { Button } from "../../../components/Button/Button";
import TextInput from "../../../components/Form/Input/TextInput";

interface Props {
  draft: DraftRoutine;
  draftComments: Partial<Record<Days, string>>;
  onClick: (day: Days) => void;
  onCommentChange: (day: Days, value: string) => void;
}

export default function DaysField({
  draft,
  draftComments,
  onClick,
  onCommentChange,
}: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      {DAYS_LIST.map((day) => (
        <div key={day}>
          <Button
            type="button"
            onClick={() => onClick(day)}
            className="bg-mist-600 hover:bg-mist-800 active:bg-mist-900"
          >
            {day} {draft[day]?.length ? `(${draft[day]!.length})` : ""}
          </Button>
          {draft[day]?.map((ex) => (
            <p key={ex.id} className="text-xs text-gray-400 px-1 py-1">
              {`${ex.exerciseName}`}
            </p>
          ))}
          {(draft[day]?.length ?? 0) > 0 && (
            <TextInput
              id={`comment-${day}`}
              type="text"
              value={draftComments[day] ?? ""}
              onChange={(v) => onCommentChange(day, v)}
              placeholder={`Comentario de la sesión (${day})`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
