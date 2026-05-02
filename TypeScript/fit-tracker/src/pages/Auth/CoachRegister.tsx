import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import {
  registerCoachFormData,
  registerCoachSchema,
} from "../../features/auth/coach/schema/coachSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterCoachFields from "../../features/auth/coach/fields/RegisterCoachFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { genUniqueId } from "../../utils/utilities";
import { Coach } from "../../types/interfaces";

export default function RegisterCoach() {
  const { addCoach } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<registerCoachFormData>({
    resolver: zodResolver(registerCoachSchema),
  });

  function onSubmit(data: registerCoachFormData) {
    console.log("Registrando coach...");
    const newCoach: Coach = {
      id: genUniqueId(),
      role: "Coach",
      ...data,
      clients: [],
    };

    addCoach(newCoach);
    login(newCoach.id);
    navigate("/coach/my_clients");
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Registro de Coach</FormTitle>
        <RegisterCoachFields control={control} />
        <Button type="submit">Registrate</Button>
      </FormContainer>
    </FormSection>
  );
}
