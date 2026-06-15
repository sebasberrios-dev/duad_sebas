import { useEffect } from "react";
import { useUsers, useCatalog, useRoutines } from "../../context/AppStore";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { BigTitle } from "../../components/Title/BigTitle";
import { StatsCard } from "../../features/system-dashboard/StatsCard";
import { WeeklyLoadTable } from "../../features/system-dashboard/WeeklyLoadTable";
import { QuickNav } from "../../features/system-dashboard/QuickNav";
import { CategoryBreakdown } from "../../features/system-dashboard/CategoryBreakdown";
import { RecentActivity } from "../../features/system-dashboard/RecentActivity";
import { downloadPdfReport } from "../../utils/export-pdf";

export default function SystemDashboard() {
  const { users, coachs, admins } = useUsers();
  const { findRoutineById } = useRoutines();
  const { catalog } = useCatalog();
  const { currentUser, isAdmin } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !isAdmin(currentUser)) {
      navigate("/admin/login", { replace: true });
    }
  }, [currentUser]);

  if (!currentUser || !isAdmin(currentUser)) return null;

  const localCount = catalog.filter((ex) => ex.source === "local").length;
  const apiCount = catalog.filter((ex) => ex.source === "api").length;
  const activeUsers = users.filter((u) => {
    const routine = findRoutineById(u.routineId);
    return routine !== undefined && routine.workouts.length > 0;
  });

  return (
    <div className="p-8 w-full h-full overflow-y-auto animate-slide-up-fade">
      <BigTitle className="text-center mb-8">Estado del sistema</BigTitle>

      <div className="grid grid-cols-3 gap-4 mb-6 ml-4">
        <StatsCard
          title="Usuarios registrados"
          value={users.length}
          detail={`${users.length} usuarios | ${coachs.length} coaches | ${admins.length} admins`}
        />
        <StatsCard
          title="Catálogo de ejercicios"
          value={catalog.length}
          detail={`${localCount} locales | ${apiCount} desde API`}
        />
        <StatsCard
          title="Rutinas activas"
          value={activeUsers.length}
          detail={`de ${users.length} usuarios totales`}
        />
      </div>

      <div className="mb-10 ml-4">
        <button
          onClick={() => downloadPdfReport(catalog, users)}
          className="px-5 py-2.5 bg-green-700 hover:bg-green-600 active:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors duration-150"
        >
          Descargar reporte PDF
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 mt-1 mb-10">
        <p className="text-sm font-semibold text-gray-300 mb-4">
          Carga semanal por usuario
        </p>
        <WeeklyLoadTable users={activeUsers} showMinutes showCalories />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-300 mb-4">
            Ejercicios por categoría
          </p>
          <CategoryBreakdown users={activeUsers} />
        </div>
        <div className="bg-gray-900 rounded-xl p-5">
          <p className="text-sm font-semibold text-gray-300 mb-4">
            Actividad reciente
          </p>
          <RecentActivity users={activeUsers} />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-5">
        <p className="text-sm font-semibold text-gray-300 mb-4">
          Acceso rápido
        </p>
        <QuickNav />
      </div>
    </div>
  );
}
