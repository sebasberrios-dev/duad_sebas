import { Controller, Control } from "react-hook-form";
import SelectInput from "../../../components/Form/Input/SelectInput";
import TextInput from "../../../components/Form/Input/TextInput";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";
import { CatalogExerciseFormData } from "../schema/catalogSchema";

const categoryOptions = [
  { id: "Cardio", displayName: "Cardio" },
  { id: "Fuerza", displayName: "Fuerza" },
  { id: "Flexibilidad", displayName: "Flexibilidad" },
];

export function ExerciseNameField({
  control,
}: {
  control: Control<CatalogExerciseFormData>;
}) {
  return (
    <Controller
      name="exerciseName"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="exerciseName">Nombre del ejercicio</FormLabel>
          <TextInput
            id="exerciseName"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Ej: Press de banca"
          />
        </FieldContainer>
      )}
    />
  );
}

export function CategoryField({
  control,
}: {
  control: Control<CatalogExerciseFormData>;
}) {
  return (
    <Controller
      name="category"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="category">Categoría</FormLabel>
          <SelectInput
            id="category"
            value={field.value ?? ""}
            options={categoryOptions}
            onChange={field.onChange}
            placeholder="Seleccionar categoría"
          />
        </FieldContainer>
      )}
    />
  );
}

export function DescriptionField({
  control,
}: {
  control: Control<CatalogExerciseFormData>;
}) {
  return (
    <Controller
      name="description"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="description">Descripción</FormLabel>
          <TextInput
            id="description"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Ej: Ejercicio compuesto para pecho y tríceps"
          />
        </FieldContainer>
      )}
    />
  );
}

export default function RegisterCatalogExerciseFields({
  control,
}: {
  control: Control<CatalogExerciseFormData>;
}) {
  return (
    <>
      <ExerciseNameField control={control} />
      <CategoryField control={control} />
      <DescriptionField control={control} />
    </>
  );
}
