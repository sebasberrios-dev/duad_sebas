import { Controller, Control } from "react-hook-form";
import { FCM_ZONES, FCM_ZONE_LABELS } from "../../../types/types";
import TextInput from "../../../components/Form/Input/TextInput";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { ExerciseFormData } from "../schema/exerciseSchema";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";

const fcmOptions = FCM_ZONES.map((zone) => ({
  id: zone,
  displayName: FCM_ZONE_LABELS[zone],
}));

export function DistanceField({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  return (
    <Controller
      name="details.distanceKm"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="distanceKm">Distancia (km)</FormLabel>
          <TextInput
            id="distanceKm"
            type="number"
            value={field.value ?? ""}
            onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
            placeholder="Ej: 5.5"
          />
        </FieldContainer>
      )}
    />
  );
}

export function FCMField({ control }: { control: Control<ExerciseFormData> }) {
  return (
    <Controller
      name="details.fcm"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="fcm">Zona de frecuencia cardíaca</FormLabel>
          <SelectInput
            id="fcm"
            value={field.value ?? ""}
            options={fcmOptions}
            onChange={field.onChange}
            placeholder="Seleccionar zona"
          />
        </FieldContainer>
      )}
    />
  );
}

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
      <DistanceField control={control} />
      <FCMField control={control} />
    </>
  );
}
