import { Button } from "../../components/Button/Button";
import { CardContainer } from "../../components/Container/CardContainer";
import { Client, User } from "../../types/interfaces";
import { printClientsInfo } from "../../utils/console";

interface Props {
  client: Client;
  users: User[];
}

export function ClientCard({ client, users }: Props) {
  return (
    <CardContainer>
      <p className="text-lg font-semibold text-white truncate">
        {client.clientName}
      </p>
      <Button type="button" onClick={() => printClientsInfo(users, client.id)}>
        Ver info
      </Button>
    </CardContainer>
  );
}
