import { useRoutines } from "../../context/RoutineContext";
import { Routine, User } from "../../types/interfaces";
import { formatDate } from "../../utils/utilities";

interface RecentActivityProps {
  users: User[];
  limit?: number;
}

export function RecentActivity({ users, limit = 5 }: RecentActivityProps) {
  const { findRoutineById } = useRoutines();

  if (users.length === 0)
    return <p className="text-sm text-gray-600">No hay actividad reciente.</p>;

  const recent = users
    .map((u) => ({ user: u, routine: findRoutineById(u.routineId) }))
    .filter(
      (entry): entry is { user: User; routine: Routine } =>
        entry.routine !== undefined,
    )
    .sort(
      (a, b) =>
        new Date(b.routine.routineStartDate).getTime() -
        new Date(a.routine.routineStartDate).getTime(),
    )
    .slice(0, limit);

  return (
    <ul className="flex flex-col gap-2">
      {recent.map(({ user, routine }) => (
        <li
          key={user.id}
          className="flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">{routine.routineName}</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(routine.routineStartDate)}
          </span>
        </li>
      ))}
    </ul>
  );
}
