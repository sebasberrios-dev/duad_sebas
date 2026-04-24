import { Controller, Control } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { ExerciseFormData } from "../schema/exerciseSchema";

export default function ExerciseBaseFields({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  return (
    <Controller
      name="durationMinutes"
      control={control}
      render={({ field }) => (
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="durationMinutes" className="text-sm text-gray-400">
            Duración (minutos)
          </label>
          <TextInput
            id="durationMinutes"
            type="number"
            value={field.value ?? ""}
            onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
            placeholder="Ej: 45"
          />
        </div>
      )}
    />
  );
}
