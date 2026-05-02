import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  catalogExerciseSchema,
  CatalogExerciseFormData,
} from "../../features/catalog-exercise/schema/catalogSchema";
import RegisterCatalogExerciseFields from "../../features/catalog-exercise/fields/RegisterCatalogExerciseFields";
import { useCatalog } from "../../context/CatalogContext";
import { FormTitle } from "../../components/Title/FormTitle";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormSection } from "../../components/Form/FormSection";
import { Button } from "../../components/Button/Button";

export default function RegisterCatalogExercise() {
  const { catalog, addExercise } = useCatalog();
  const { control, handleSubmit, reset } = useForm<CatalogExerciseFormData>({
    resolver: zodResolver(catalogExerciseSchema),
  });

  function onSubmit(data: CatalogExerciseFormData) {
    addExercise({ ...data, id: catalog.length + 1 });
    reset();
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Registrar ejercicio al catálogo</FormTitle>

        <RegisterCatalogExerciseFields control={control} />

        <Button type="submit">Guardar en catálogo</Button>
      </FormContainer>
    </FormSection>
  );
}
