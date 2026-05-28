import { useEffect } from "react";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router";
import { useUsers } from "../../context/UserContext";
import { BigTitle } from "../../components/Title/BigTitle";
import { WeeklyLoadTable } from "../../features/system-dashboard/WeeklyLoadTable";

export default function CoachView() {
  const { users } = useUsers();
  const { currentUser, isCoach } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !isCoach(currentUser)) {
      navigate("/coach/login", { replace: true });
    }
  }, [currentUser]);

  if (!currentUser || !isCoach(currentUser)) return null;

  const clientUsers = users.filter(
    (u) =>
      currentUser.clients.some((c) => c.id === u.id) &&
      u.routine.workouts.length > 0,
  );

  return (
    <div className="p-8 w-full h-full mt-7 animate-slide-up-fade">
      <BigTitle className="text-center mb-8">Mis clientes</BigTitle>
      <div className="bg-gray-900 rounded-xl p-5">
        <WeeklyLoadTable users={clientUsers} firstColumnLabel="Cliente" showAge showWeight />
      </div>
    </div>
  );
}
