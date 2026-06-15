import { Controller, Control } from "react-hook-form";
import TextInput from "../../../components/Form/Input/TextInput";
import { ExerciseFormData } from "../schema/exerciseSchema";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";

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
          <FieldContainer>
            <FormLabel htmlFor="poses">Número de poses</FormLabel>
            <TextInput
              id="poses"
              type="number"
              value={field.value ?? ""}
              onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
              placeholder="Ej: 10"
            />
          </FieldContainer>
        )}
      />
    </>
  );
}
