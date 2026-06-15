import { Controller, Control } from "react-hook-form";
import { RegisterRoutineFormData } from "../schema/routineSchema";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import TextInput from "../../../components/Form/Input/TextInput";

export default function RoutineNameField({
  control,
}: {
  control: Control<RegisterRoutineFormData>;
}) {
  return (
    <Controller
      name="routineName"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="routineName">
            <TextInput
              id="routineName"
              type="text"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Nombre de la rutina"
            />
          </FormLabel>
        </FieldContainer>
      )}
    />
  );
}
