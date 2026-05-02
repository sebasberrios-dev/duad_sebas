import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import {
  registerUserFormData,
  registerUserSchema,
} from "../../features/auth/user/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "../../types/interfaces";
import RegisterUserFields from "../../features/auth/user/fields/RegisterUserFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { AuthRedirectLink } from "../../components/Form/AuthRedirectLink";

export default function RegisterUser() {
  const { addUser } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<registerUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  function onSubmit(data: registerUserFormData) {
    console.log("Registrando usuario...");
    const newUser: User = {
      id: Date.now(),
      role: "User",
      ...data,
      membership: {
        id: Date.now() + 1,
        ...data.membership,
        status: "active",
        startDate: new Date().toISOString(),
      },
      routine: {
        id: Date.now() + 2,
        routineName: "",
        routineStartDate: "",
        workouts: [],
      },
    };

    addUser(newUser);
    login(newUser.id);
    navigate("/routine");
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Registro</FormTitle>
        <RegisterUserFields control={control} />
        <Button type="submit">Registrarse</Button>
        <AuthRedirectLink
          prompt="¿Ya tienes una cuenta?"
          linkText="Ingresa a tu cuenta"
          onClick={() => navigate("/login")}
        />
      </FormContainer>
    </FormSection>
  );
}
