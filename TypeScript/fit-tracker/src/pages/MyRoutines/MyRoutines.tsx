import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "../../context/SessionContext";
import { BigTitle } from "../../components/Title/BigTitle";
import { WorkoutDaySection } from "../../features/my-routines/WorkoutDaySection";

export default function MyRoutines() {
  const { currentUser, isUser } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !isUser(currentUser)) {
      navigate("/login", { replace: true });
    }
  }, [currentUser]);

  if (!currentUser || !isUser(currentUser)) return null;

  const { routine } = currentUser;

  return (
    <div className="p-8 w-full h-full mt-7 animate-slide-up-fade">
      {!routine || routine.workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <p className="text-gray-400 text-sm">
            No tienes ninguna rutina asignada aún.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col gap-1">
            <BigTitle>{routine.routineName}</BigTitle>
            <p className="text-xs text-gray-500">
              Desde{" "}
              {new Date(routine.routineStartDate).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {routine.workouts.map((workout) => (
              <WorkoutDaySection
                key={workout.day.join("-")}
                workout={workout}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
