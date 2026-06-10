import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import {
  catalogExerciseSchema,
  CatalogExerciseFormData,
} from "../../features/catalog-exercise/schema/catalogSchema";
import RegisterCatalogExerciseFields from "../../features/catalog-exercise/fields/RegisterCatalogExerciseFields";
import { useCatalog } from "../../context/AppStore";
import { useSession } from "../../context/SessionContext";
import { FormTitle } from "../../components/Title/FormTitle";
import { FormContainer } from "../../components/Container/FormContainer";
import { Button } from "../../components/Button/Button";

export default function RegisterCatalogExercise() {
  const { addExercise } = useCatalog();
  const { currentUser, isAdmin } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm<CatalogExerciseFormData>({
    resolver: zodResolver(catalogExerciseSchema),
  });

  useEffect(() => {
    if (!currentUser || !isAdmin(currentUser)) {
      navigate("/admin/login", { replace: true });
    }
  }, [currentUser]);

  if (!currentUser || !isAdmin(currentUser)) return null;

  function onSubmit(data: CatalogExerciseFormData) {
    addExercise(data);
    reset();
  }

  return (
    <FormContainer
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-850 shadow-2xl"
    >
      <FormTitle>Registrar ejercicio al catálogo</FormTitle>

      <RegisterCatalogExerciseFields control={control} />

      <Button type="submit">Guardar en catálogo</Button>
    </FormContainer>
  );
}
