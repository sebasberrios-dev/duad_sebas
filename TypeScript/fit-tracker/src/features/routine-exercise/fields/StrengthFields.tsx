import { useFieldArray, Controller, Control } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { ExerciseFormData } from "../schema/exerciseSchema";

export default function StrengthFields({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details.sets",
  });

  return (
    <>
      <p className="w-full text-xs font-semibold text-green-700 uppercase tracking-widest">
        Sets
      </p>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex flex-col gap-3"
        >
          <div className="flex gap-3">
            <Controller
              name={`details.sets.${index}.reps`}
              control={control}
              render={({ field }) => (
                <div className="flex-1 flex flex-col gap-1">
                  <label
                    htmlFor={`reps-${index}`}
                    className="text-sm text-gray-400"
                  >
                    Repeticiones
                  </label>
                  <TextInput
                    id={`reps-${index}`}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(v) =>
                      field.onChange(v === "" ? undefined : Number(v))
                    }
                    placeholder="Ej: 12"
                  />
                </div>
              )}
            />
            <Controller
              name={`details.sets.${index}.weightKg`}
              control={control}
              render={({ field }) => (
                <div className="flex-1 flex flex-col gap-1">
                  <label
                    htmlFor={`weight-${index}`}
                    className="text-sm text-gray-400"
                  >
                    Peso (kg)
                  </label>
                  <TextInput
                    id={`weight-${index}`}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(v) =>
                      field.onChange(v === "" ? undefined : Number(v))
                    }
                    placeholder="Ej: 60"
                  />
                </div>
              )}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-400 text-xs self-end hover:text-red-300 transition cursor-pointer"
          >
            Eliminar set
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            reps: undefined as unknown as number,
            weightKg: undefined as unknown as number,
          })
        }
        className="w-full border border-green-700 text-emerald-600 rounded-lg py-2 text-sm hover:bg-green-900/30 transition cursor-pointer"
      >
        + Agregar set
      </button>
    </>
  );
}
