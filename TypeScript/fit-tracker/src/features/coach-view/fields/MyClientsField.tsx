import { MyClientsProps } from "../props/my-clients-props";
import { ClientCard } from "../ClientCard";

export function MyClientsField({ clients, users }: MyClientsProps) {
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
