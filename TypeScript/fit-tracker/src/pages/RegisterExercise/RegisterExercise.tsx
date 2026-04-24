import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseSchema, ExerciseFormData } from "./schema/exerciseSchema";
import ExerciseBaseFields from "./Fields/ExerciseBaseFields";
import CardioFields from "./Fields/CardioFields";
import StrengthFields from "./Fields/StrengthFields";
import FlexFields from "./Fields/FlexFields";
import SelectInput from "../../components/Form/Input/SelectInput";
import { useCatalog } from "../../context/CatalogContext";
import { useSession } from "../../context/SessionContext";
import { Exercise } from "../../types/interfaces";
import { printUserInfo, printWorkoutStats } from "../../utils/console";

export default function RegisterExercise() {
  const { catalog } = useCatalog();
  const { currentUser, updateCurrentUser } = useSession();
  const catalogOptions = catalog.map((e) => ({
    id: String(e.id),
    displayName: e.exerciseName,
  }));
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<ExerciseFormData>({
      resolver: zodResolver(exerciseSchema),
    });
  const category = watch("category");

  function onSubmit(data: ExerciseFormData) {
    if (!currentUser) return;

    let details: Exercise["details"];
    if (data.category === "Cardio") {
      details = { category: "Cardio", ...data.details };
    } else if (data.category === "Fuerza") {
      details = { category: "Fuerza", ...data.details };
    } else {
      details = { category: "Flexibilidad", ...data.details };
    }

    const newExercise: Exercise = {
      id: Date.now(),
      exerciseName: data.exerciseName,
      durationMinutes: data.durationMinutes,
      details,
    };

    const updatedUser = {
      ...currentUser,
      routine: {
        ...currentUser.routine,
        entries: [
          ...currentUser.routine.entries,
          { day: [], exercise: newExercise },
        ],
      },
    };

    updateCurrentUser(updatedUser);
    reset();
  }

  function handleSeeRoutine() {
    if (!currentUser) return;
    printUserInfo(currentUser);
    printWorkoutStats(currentUser.routine, currentUser);
  }

  return (
    <section className="bg-linear-to-bl from-black to-green-900 min-h-dvh grid place-items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade"
      >
        <h2 className="text-2xl font-bold text-white self-center">
          Registrar ejercicio
        </h2>

        <Controller
          name="catalogExerciseId"
          control={control}
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1">
              <label
                htmlFor="catalogExercise"
                className="text-sm text-gray-400"
              >
                Ejercicio
              </label>
              <SelectInput
                id="catalogExercise"
                value={field.value ? String(field.value) : ""}
                options={catalogOptions}
                onChange={(id) => {
                  const exercise = catalog.find((e) => e.id === Number(id));
                  if (!exercise) return;
                  field.onChange(Number(id));
                  setValue("exerciseName", exercise.exerciseName);
                  setValue("category", exercise.category);
                }}
                placeholder="Seleccionar ejercicio"
              />
            </div>
          )}
        />

        <ExerciseBaseFields control={control} />

        {category === "Cardio" && <CardioFields control={control} />}
        {category === "Fuerza" && <StrengthFields control={control} />}
        {category === "Flexibilidad" && <FlexFields control={control} />}

        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer mt-2"
        >
          Guardar ejercicio
        </button>
        <button
          type="button"
          onClick={handleSeeRoutine}
          className="w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-700 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer"
        >
          Ver mi rutina
        </button>
      </form>
    </section>
  );
}
