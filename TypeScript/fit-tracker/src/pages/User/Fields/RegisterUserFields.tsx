import { Controller, Control } from "react-hook-form";
import { registerUserFormData } from "../schema/userSchema";
import TextInput from "../../../components/Form/Input/TextInput";
import SelectInput from "../../../components/Form/Input/SelectInput";

const levelOptions = [
  { id: "Principiante", displayName: "Principiante" },
  { id: "Intermedio", displayName: "Intermedio" },
  { id: "Avanzado", displayName: "Avanzado" },
];

const planOptions = [
  { id: "Free", displayName: "Free" },
  { id: "Premium", displayName: "Premium" },
];

export default function RegisterUserFields({
  control,
}: {
  control: Control<registerUserFormData>;
}) {
  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-gray-400">
              <TextInput
                id="name"
                type="text"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Nombre"
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="age" className="text-sm text-gray-400">
              <TextInput
                id="age"
                type="number"
                value={field.value ?? ""}
                onChange={(v) =>
                  field.onChange(v === "" ? undefined : Number(v))
                }
                placeholder="Edad"
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="bodyWeight"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="age" className="text-sm text-gray-400">
              <TextInput
                id="bodyWeight"
                type="number"
                value={field.value ?? ""}
                onChange={(v) =>
                  field.onChange(v === "" ? undefined : Number(v))
                }
                placeholder="Peso corporal (kg)"
              />
            </label>
          </div>
        )}
      />

      <Controller
        name="level"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="level" className="text-sm text-gray-400">
              <SelectInput
                id="level"
                value={field.value ?? ""}
                onChange={field.onChange}
                options={levelOptions}
                placeholder="Seleccione su nivel"
              />
            </label>
          </div>
        )}
      />
      <p className="w-full text-xs font-semibold text-green-700 uppercase tracking-widest">
        Membresía
      </p>
      <Controller
        name="membership.plan"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="plan" className="text-sm text-gray-400">
              <SelectInput
                id="plan"
                value={field.value ?? ""}
                onChange={field.onChange}
                options={planOptions}
                placeholder="Seleccione su plan"
              />
            </label>
          </div>
        )}
      />
    </>
  );
}
