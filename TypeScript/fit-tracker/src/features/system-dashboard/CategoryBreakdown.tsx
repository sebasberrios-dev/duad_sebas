import { useRoutines } from "../../context/RoutineContext";
import { User } from "../../types/interfaces";
import { getTotalExercisesByCategory } from "../../utils/utilities";

interface CategoryBreakdownProps {
  users: User[];
}

export function CategoryBreakdown({ users }: CategoryBreakdownProps) {
  const { findRoutineById } = useRoutines();

  if (users.length === 0)
    return <p className="text-sm text-gray-600">No hay rutinas activas.</p>;

  const totals = users.reduce(
    (acc, u) => {
      const routine = findRoutineById(u.routineId);
      if (!routine) return acc;
      const { totalCardio, totalStrength, totalFlex } =
        getTotalExercisesByCategory(routine);
      return {
        cardio: acc.cardio + totalCardio,
        strength: acc.strength + totalStrength,
        flex: acc.flex + totalFlex,
      };
    },
    { cardio: 0, strength: 0, flex: 0 },
  );

  const items = [
    { label: "Cardio", value: totals.cardio, color: "text-blue-400" },
    { label: "Fuerza", value: totals.strength, color: "text-green-400" },
    { label: "Flexibilidad", value: totals.flex, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-gray-800 rounded-lg py-4"
        >
          <span className={`text-2xl font-bold ${color}`}>{value}</span>
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}
