import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { FormSection } from "../../components/Form/FormSection";
import { Container } from "../../components/Container/Container";
import { BigTitle } from "../../components/Title/BigTitle";
import { MyClientsField } from "../../features/coach-view/fields/MyClientsField";
import { useUsers } from "../../context/UserContext";

export default function CoachView() {
  const { users } = useUsers();
  const { currentUser } = useSession();
  const navigate = useNavigate();

  if (!currentUser) {
    alert("No hay sesión");
    navigate("login/coach");
    return;
  }

  if (currentUser?.role !== "Coach") {
    alert("No eres coach! Redirigiendo...");
    navigate("login");
    return;
  }

  const clients = currentUser.clients;

  return (
    <FormSection>
      <Container className="self-start mt-52">
        <BigTitle>Mis clientes</BigTitle>
        <MyClientsField clients={clients} users={users}></MyClientsField>
      </Container>
    </FormSection>
  );
}
