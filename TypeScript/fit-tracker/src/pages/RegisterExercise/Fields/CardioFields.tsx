import { Controller, Control } from "react-hook-form";
import { FCM_ZONES, FCM_ZONE_LABELS } from "../../../types/types";
import TextInput from "../../../components/Form/Input/TextInput";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { ExerciseFormData } from "../schema/exerciseSchema";

const fcmOptions = FCM_ZONES.map((zone) => ({
  id: zone,
  displayName: FCM_ZONE_LABELS[zone],
}));

export default function CardioFields({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  return (
    <>
      <p className="w-full text-xs font-semibold text-green-700 uppercase tracking-widest">
        Detalles de Cardio
      </p>
      <Controller
        name="details.distanceKm"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="distanceKm" className="text-sm text-gray-400">
              Distancia (km)
            </label>
            <TextInput
              id="distanceKm"
              type="number"
              value={field.value ?? ""}
              onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
              placeholder="Ej: 5.5"
            />
          </div>
        )}
      />
      <Controller
        name="details.fcm"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="fcm" className="text-sm text-gray-400">
              Zona de frecuencia cardíaca
            </label>
            <SelectInput
              id="fcm"
              value={field.value ?? ""}
              options={fcmOptions}
              onChange={field.onChange}
              placeholder="Seleccionar zona"
            />
          </div>
        )}
      />
    </>
  );
}
