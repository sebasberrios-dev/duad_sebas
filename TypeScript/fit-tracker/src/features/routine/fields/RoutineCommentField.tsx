import { Controller, Control } from "react-hook-form";
import { RegisterRoutineFormData } from "../schema/routineSchema";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import TextInput from "../../../components/Form/Input/TextInput";

export default function RoutineCommentField({
  control,
}: {
  control: Control<RegisterRoutineFormData>;
}) {
  return (
    <Controller
      name="routineComment"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="routineComment">
            <TextInput
              id="routineComment"
              type="text"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Comentario de la rutina (opcional)"
            />
          </FormLabel>
        </FieldContainer>
      )}
    />
  );
}
