import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginUserFormData,
  loginUserSchema,
} from "../../features/auth/user/schema/userSchema";
import LoginUserFields from "../../features/auth/user/fields/LoginUserFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { AuthRedirectLink } from "../../components/Form/AuthRedirectLink";

export default function LoginUser() {
  const { users } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit, setError } = useForm<loginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });

  function onSubmit(data: loginUserFormData) {
    const user = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase(),
    );

    if (!user) {
      setError("email", { message: "Usuario no encontrado" });
      return;
    }

    login(user.id);
    navigate("/routine");
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Iniciar Sesión</FormTitle>
        <LoginUserFields control={control} />
        <Button type="submit">Ingresar</Button>
        <AuthRedirectLink
          prompt="¿No te has registrado?"
          linkText="Registrate"
          onClick={() => navigate("/")}
        />
      </FormContainer>
    </FormSection>
  );
}
