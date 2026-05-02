import { Controller, Control } from "react-hook-form";
import { ExerciseFormData } from "../schema/exerciseSchema";

export default function CompleteField({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  return (
    <Controller
      name="complete"
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <div className="w-full mt-1">
          <p className="text-sm font-semibold text-white mb-2">
            ¿Completaste el ejercicio?
          </p>
          <div className="flex gap-3">
            {[
              { label: "Sí", value: true },
              { label: "No", value: false },
            ].map(({ label, value }) => (
              <label
                key={label}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 cursor-pointer text-sm font-semibold transition
                  ${
                    field.value === value
                      ? value
                        ? "border-green-500 bg-green-900 text-green-300"
                        : "border-red-500 bg-red-900 text-red-300"
                      : "border-zinc-600 bg-zinc-800 text-zinc-400 hover:border-zinc-400"
                  }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={field.value === value}
                  onChange={() => field.onChange(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}
    />
  );
}
