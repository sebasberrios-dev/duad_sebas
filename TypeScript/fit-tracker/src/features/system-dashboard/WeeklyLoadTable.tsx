import { useRoutines } from "../../context/RoutineContext";
import { WeeklyLoadTableProps } from "./props/weekly-load-table-props";
import {
  getTotalDuration,
  calculateAllCalories,
  calculateWeeklyAvgCalories,
  getWeeklyRecommendation,
} from "../../utils/utilities";

export function WeeklyLoadTable({
  users,
  firstColumnLabel = "Usuario",
  showAge = false,
  showWeight = false,
  showMinutes = false,
  showCalories = false,
}: WeeklyLoadTableProps) {
  const { findRoutineById } = useRoutines();

  if (users.length === 0)
    return (
      <p className="text-sm text-gray-600">
        No hay usuarios con rutinas activas.
      </p>
    );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-800">
          <th className="pb-2 font-medium">{firstColumnLabel}</th>
          {showAge && <th className="pb-2 font-medium">Edad</th>}
          {showWeight && <th className="pb-2 font-medium">Peso</th>}
          <th className="pb-2 font-medium">Nivel</th>
          <th className="pb-2 font-medium">Rutina</th>
          <th className="pb-2 font-medium">Duración</th>
          {showMinutes && <th className="pb-2 font-medium">Minutos</th>}
          {showCalories && <th className="pb-2 font-medium">Calorías</th>}
          <th className="pb-2 font-medium">Días</th>
          <th className="pb-2 font-medium">Recomendación</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => {
          const routine = findRoutineById(u.routineId);
          if (!routine) return null;

          const { formatTotalDuration, total } = getTotalDuration(routine);
          const { totalCalories } = calculateAllCalories(
            routine,
            u.bodyWeight,
            u.level,
          );
          const { uniqueDays } = calculateWeeklyAvgCalories(
            routine,
            totalCalories,
          );
          const recommendation = getWeeklyRecommendation(
            routine,
            u.bodyWeight,
            u.level,
          );

          return (
            <tr key={u.id} className="border-b border-gray-800 last:border-0">
              <td className="py-3">{u.name}</td>
              {showAge && <td className="py-3 text-gray-400">{u.age}</td>}
              {showWeight && (
                <td className="py-3 text-gray-400">{u.bodyWeight} kg</td>
              )}
              <td className="py-3 text-gray-400">{u.level}</td>
              <td className="py-3 text-gray-400">{routine.routineName}</td>
              <td className="py-3 text-gray-400">{formatTotalDuration}</td>
              {showMinutes && (
                <td className="py-3 text-gray-400">{total} min</td>
              )}
              {showCalories && (
                <td className="py-3 text-gray-400">{totalCalories} kcal</td>
              )}
              <td className="py-3 text-gray-400">{uniqueDays}</td>
              <td className="py-3 text-gray-400">{recommendation}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
