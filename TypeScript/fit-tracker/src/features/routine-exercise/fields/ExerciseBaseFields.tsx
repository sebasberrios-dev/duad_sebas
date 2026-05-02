import { Controller, Control } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { ExerciseFormData } from "../schema/exerciseSchema";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";

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
        <FieldContainer>
          <FormLabel htmlFor="durationMinutes">Duración (minutos)</FormLabel>
          <TextInput
            id="durationMinutes"
            type="number"
            value={field.value ?? ""}
            onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
            placeholder="Ej: 45"
          />
        </FieldContainer>
      )}
    />
  );
}
