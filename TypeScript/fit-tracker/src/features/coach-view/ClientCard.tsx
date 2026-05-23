import { Button } from "../../components/Button/Button";
import { CardContainer } from "../../components/Container/CardContainer";
import { ClientCardProps } from "./props/client-card-props";
import { printClientsInfo } from "../../utils/console";

export function ClientCard({ client, users }: ClientCardProps) {
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
