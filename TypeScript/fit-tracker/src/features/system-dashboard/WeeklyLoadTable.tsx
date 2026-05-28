import { WeeklyLoadTableProps } from "./props/weekly-load-table-props";
import {
  getTotalDuration,
  calculateAllCalories,
  calculateWeeklyAvgCalories,
  getWeeklyRecommendation,
} from "../../utils/utilities";

export function WeeklyLoadTable({ users, firstColumnLabel = "Usuario", showAge = false, showWeight = false }: WeeklyLoadTableProps) {
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
          <th className="pb-2 font-medium">Días</th>
          <th className="pb-2 font-medium">Recomendación</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => {
          const { formatTotalDuration } = getTotalDuration(u.routine);
          const { totalCalories } = calculateAllCalories(
            u.routine,
            u.bodyWeight,
            u.level,
          );
          const { uniqueDays } = calculateWeeklyAvgCalories(
            u.routine,
            totalCalories,
          );
          const recommendation = getWeeklyRecommendation(
            u.routine,
            u.bodyWeight,
            u.level,
          );
          return (
            <tr key={u.id} className="border-b border-gray-800 last:border-0">
              <td className="py-3">{u.name}</td>
              {showAge && <td className="py-3 text-gray-400">{u.age}</td>}
              {showWeight && <td className="py-3 text-gray-400">{u.bodyWeight} kg</td>}
              <td className="py-3 text-gray-400">{u.level}</td>
              <td className="py-3 text-gray-400">{u.routine.routineName}</td>
              <td className="py-3 text-gray-400">{formatTotalDuration}</td>
              <td className="py-3 text-gray-400">{uniqueDays}</td>
              <td className="py-3 text-gray-400">{recommendation}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
