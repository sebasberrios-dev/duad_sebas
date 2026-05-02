import { Controller, Control } from "react-hook-form";
import { UseFormSetValue } from "react-hook-form";
import { ExerciseFormData } from "../schema/exerciseSchema";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { useCatalog } from "../../../context/CatalogContext";

interface Props {
  control: Control<ExerciseFormData>;
  catalogOptions: {
    id: string;
    displayName: string;
  }[];
  setValue: UseFormSetValue<ExerciseFormData>;
}

export default function RegisterExerciseFields({
  control,
  catalogOptions,
  setValue,
}: Props) {
  const { catalog } = useCatalog();
  return (
    <Controller
      name="catalogExerciseId"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="catalogExercise">Ejercicio</FormLabel>
          <SelectInput
            id="catalogExercise"
            value={field.value ? String(field.value) : ""}
            options={catalogOptions}
            onChange={(id) => {
              const exercise = catalog.find((e) => e.id === Number(id));
              if (!exercise) return;
              field.onChange(Number(id));
              setValue("exerciseName", exercise.exerciseName);
              setValue("category", exercise.category);
            }}
            placeholder="Seleccionar ejercicio"
          />
        </FieldContainer>
      )}
    />
  );
}
