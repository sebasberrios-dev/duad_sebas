import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { ClientsField } from "../../features/assign-coach/fields/ClientsField";
import { CoachsField } from "../../features/assign-coach/fields/CoachsField";
import { useUsers } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import {
  assignCoachFormData,
  assignCoachSchema,
} from "../../features/assign-coach/schema/assignCoachSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AssignCoach() {
  const { users, coachs, updateCoach } = useUsers();
  const { control, handleSubmit, setError, reset } =
    useForm<assignCoachFormData>({
      resolver: zodResolver(assignCoachSchema),
    });

  function onSubmit(data: assignCoachFormData) {
    console.log("Asignando coach...");
    const coach = coachs.find((c) => c.id === data.coachId);
    const user = users.find((u) => u.id === data.clientId);

    if (!coach) {
      setError("coachId", { message: "Coach no encontrado" });
      return;
    }
    if (!user) {
      setError("clientId", { message: "Usuario no encontrado" });
      return;
    }

    const newClient = {
      id: user.id,
      clientName: user.name,
    };

    const updatedCoach = {
      ...coach,
      clients: [...coach.clients, newClient],
    };

    updateCoach(updatedCoach);
    reset();
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Asignar Coach</FormTitle>
        <ClientsField control={control} />
        <CoachsField control={control} />
        <Button type="submit">Asignar</Button>
      </FormContainer>
    </FormSection>
  );
}
