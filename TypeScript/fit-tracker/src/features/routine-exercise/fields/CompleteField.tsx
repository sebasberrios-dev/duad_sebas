import { Controller, Control } from "react-hook-form";
import { ExerciseFormData } from "../schema/exerciseSchema";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { statusOptions } from "../types/options";

export default function CompleteField({
  control,
}: {
  control: Control<ExerciseFormData>;
}) {
  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="status">Estado de entrenamiento</FormLabel>
          <SelectInput
            id="status"
            value={field.value ?? ""}
            options={statusOptions}
            onChange={field.onChange}
            placeholder="Seleccionar estado"
          />
        </FieldContainer>
      )}
    />
  );
}
