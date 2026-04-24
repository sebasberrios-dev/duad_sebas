import { Controller, Control } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { ExerciseFormData } from "../schema/exerciseSchema";

export default function FlexFields({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  return (
    <>
      <p className="w-full text-xs font-semibold text-green-700 uppercase tracking-widest">
        Detalles de Flexibilidad
      </p>
      <Controller
        name="details.poses"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="poses" className="text-sm text-gray-400">
              Número de poses
            </label>
            <TextInput
              id="poses"
              type="number"
              value={field.value ?? ""}
              onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
              placeholder="Ej: 10"
            />
          </div>
        )}
      />
    </>
  );
}
