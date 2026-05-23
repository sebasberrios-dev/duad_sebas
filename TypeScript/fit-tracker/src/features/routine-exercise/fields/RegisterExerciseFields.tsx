import { Controller } from "react-hook-form";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { useCatalog } from "../../../context/CatalogContext";
import { RegisterExerciseProps } from "../props/register-exercises-props";
import { ExerciseCategory, EXERCISES_CATEGORIES } from "../../../types/types";

export default function RegisterExerciseFields({
  control,
  catalogOptions,
  setValue,
}: RegisterExerciseProps) {
  const { catalog } = useCatalog();

  function isExerciseCategory(
    val: string | undefined,
  ): val is ExerciseCategory {
    return EXERCISES_CATEGORIES.some((cat) => cat === val);
  }
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
              if (isExerciseCategory(exercise.category)) {
                setValue("category", exercise.category);
              }
            }}
            placeholder="Seleccionar ejercicio"
          />
        </FieldContainer>
      )}
    />
  );
}
