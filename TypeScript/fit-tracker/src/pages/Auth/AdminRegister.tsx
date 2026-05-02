import { useUsers } from "../../context/UserContext";
import { useSession } from "../../context/SessionContext";
import { useForm } from "react-hook-form";
import {
  registerAdminFormData,
  registerAdminSchema,
} from "../../features/auth/admin/schema/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisterAdminFields from "../../features/auth/admin/fields/RegisterAdminFields";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import { Button } from "../../components/Button/Button";
import { Admin } from "../../types/interfaces";

export default function RegisterAdmin() {
  const { addAdmin } = useUsers();
  const { login } = useSession();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<registerAdminFormData>({
    resolver: zodResolver(registerAdminSchema),
  });

  function onSubmit(data: registerAdminFormData) {
    console.log("Registrando admin...");
    const newAdmin: Admin = {
      id: Date.now(),
      role: "Admin",
      ...data,
    };

    addAdmin(newAdmin);
    login(newAdmin.id);
    navigate("admin/exercise");
  }

  return (
    <FormSection>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <FormTitle>Registro de Admin</FormTitle>
        <RegisterAdminFields control={control} />
        <Button type="submit">Registrate</Button>
      </FormContainer>
    </FormSection>
  );
}
