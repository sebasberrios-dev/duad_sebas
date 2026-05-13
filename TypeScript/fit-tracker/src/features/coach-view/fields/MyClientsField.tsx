import { Client, User } from "../../../types/interfaces";
import { ClientCard } from "../ClientCard";

interface Props {
  clients: Client[];
  users: User[];
}

export function MyClientsField({ clients, users }: Props) {
  if (clients.length === 0) {
    return <p className="text-gray-500">No tienes clientes</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4 w-full mt-9 ml-8">
      {clients.map((client) => (
        <ClientCard key={client.id} client={client} users={users} />
      ))}
    </div>
  );
}
