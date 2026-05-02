import { Button } from "../../../components/Button/Button";
import { Client, User } from "../../../types/interfaces";
import { printClientsInfo } from "../../../utils/console";

interface Props {
  clients: Client[];
  users: User[];
}

export function MyClientsField({ clients, users }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      {clients.length === 0 && (
        <p className="text-lg text-gray-500 text-center mt-2">
          No tienes clientes
        </p>
      )}
      {clients.map((client) => (
        <div
          key={client.id}
          className="w-full bg-mist-700 flex flex-col gap-2 rounded-xl p-5"
        >
          <p className="text-2xl text-gray-200">{client.clientName}</p>
          <Button
            type="button"
            onClick={() => printClientsInfo(users, client.id)}
          >
            Ver info
          </Button>
        </div>
      ))}
    </div>
  );
}
