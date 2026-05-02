import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  loginCoachFormData,
  loginCoachSchema,
} from "../../features/auth/coach/schema/coachSchema";
import LoginCoachFields from "../../features/auth/coach/fields/LoginCoachFields";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginCoach() {
  const { coachs } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<loginCoachFormData>({
    resolver: zodResolver(loginCoachSchema),
  });

  function onSubmit(data: loginCoachFormData) {
    const coach = coachs.find(
      (u) => u.email.toLowerCase() === data.email.toLocaleLowerCase(),
    );

    if (!coach) {
      setError("email", { message: "Coach no encontrado" });
      return;
    }

    login(coach.id);
    navigate("/coach/my_clients");
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Iniciar Sesión</FormTitle>
        <LoginCoachFields control={control} />
        <Button type="submit">Ingresar</Button>
      </FormContainer>
    </FormSection>
  );
}
