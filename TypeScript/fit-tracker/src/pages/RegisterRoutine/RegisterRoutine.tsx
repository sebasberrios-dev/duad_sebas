import { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { useCatalog } from "../../context/CatalogContext";
import { Exercise, User } from "../../types/interfaces";
import { Days, DAYS_LIST, DraftRoutine } from "../../types/types";
import { CatalogExercise } from "../../features/catalog-exercise/types/catalog-exercise.types";
import Modal from "../../components/Modal/Modal";
import RegisterExercise from "../../features/routine-exercise/RegisterExercise";
import { Button } from "../../components/Button/Button";
import RoutineNameField from "../../features/routine/fields/RoutineNameField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterRoutineFormData,
  registerRoutineSchema,
} from "../../features/routine/schema/routineSchema";
import { printRoutine, printWeeklyLoad } from "../../utils/console";
import SelectInput from "../../components/Form/Input/SelectInput";
import RoutineCatalogField from "../../features/catalog/fields/RoutineCatalogField";
import { BigTitle } from "../../components/Title/BigTitle";
import { muscleOptions } from "../../features/catalog-exercise/types/muscle-options";

const daysOptions = DAYS_LIST.map((day) => ({ id: day, displayName: day }));

const categoryOptions = [
  { id: "Cardio", displayName: "Cardio" },
  { id: "Fuerza", displayName: "Fuerza" },
  { id: "Flexibilidad", displayName: "Flexibilidad" },
];

const categoryToApiType: Record<string, string> = {
  Cardio: "cardio",
  Fuerza: "strength",
  Flexibilidad: "stretching",
};

export default function RegisterRoutine() {
  const [draft, setDraft] = useState<DraftRoutine>({});
  const [draftComments, setDraftComments] = useState<
    Partial<Record<Days, string>>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Days | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [catalogExerciseToAdd, setCatalogExerciseToAdd] =
    useState<CatalogExercise | null>(null);

  const { currentUser, updateCurrentUser } = useSession();
  const { catalog, apiCatalog, loading, error, getMuscle, getType } =
    useCatalog();
  const { control, handleSubmit } = useForm<RegisterRoutineFormData>({
    resolver: zodResolver(registerRoutineSchema),
  });

  const filteredExercises = catalog.filter((ex) => {
    const matchesCategory = selectedCategory
      ? ex.category === selectedCategory
      : true;
    const matchesMuscle = selectedMuscle ? ex.muscle === selectedMuscle : true;
    return matchesCategory && matchesMuscle;
  });

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedMuscle("");
    getType(categoryToApiType[category]);
  }

  function handleMuscleChange(muscle: string) {
    setSelectedMuscle(muscle);
    getMuscle(muscle);
  }

  function handleExerciseAdded(exercise: Exercise) {
    if (!selectedDay) return;
    setDraft((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] ?? []), exercise],
    }));
    setIsModalOpen(false);
  }

  function handleAddFromCatalog(exercise: CatalogExercise) {
    if (!selectedDay) return;
    setCatalogExerciseToAdd(exercise);
    setIsModalOpen(true);
  }

  function handleSaveRoutine(data: RegisterRoutineFormData) {
    if (!currentUser) return;

    const workouts = Object.entries(draft).map(([day, exercises]) => ({
      day: [day as Days],
      exercises: exercises,
      comment: draftComments[day as Days],
    }));

    const updatedUser = {
      ...currentUser,
      routine: {
        id: Date.now(),
        routineName: data.routineName,
        routineStartDate: new Date().toISOString(),
        workouts,
      },
    };

    updateCurrentUser(updatedUser);
    setDraft({});
    setDraftComments({});
  }

  function handleClearRoutine() {
    setDraft({});
    setDraftComments({});
  }

  function handleSeeRoutine() {
    const user = currentUser as User;
    const routine = user.routine;

    printRoutine(routine, user);
    printWeeklyLoad(routine, user);
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedDay && (
          <RegisterExercise
            day={selectedDay}
            preloaded={catalogExerciseToAdd ?? undefined}
            onSuccess={handleExerciseAdded}
          />
        )}
      </Modal>

      <div className="flex flex-row gap-6 p-6 w-full h-full mt-7 animate-slide-up-fade">
        <div className=" flex flex-col gap-4 p-2 w-72 shrink-0 border-0">
          <RoutineNameField control={control} />
          <SelectInput
            id="day-select"
            value={selectedDay ?? ""}
            onChange={(val) => setSelectedDay(val as Days)}
            options={daysOptions}
            placeholder="Seleccionar día"
            className="bg-gray-900 border-none"
          />

          <div className="flex flex-col gap-3 mt-2">
            {DAYS_LIST.map((day) => (
              <div key={day} className="py-3 border-b">
                <p className="text-sm font-semibold text-white mb-1">{day}</p>
                {draft[day]?.length ? (
                  draft[day]!.map((ex) => (
                    <p
                      key={ex.id}
                      className="text-xs text-gray-400 pl-1 py-0.5"
                    >
                      {ex.exerciseName}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-gray-600 pl-1.5">Sin ejercicios</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-auto pt-4">
            <Button type="button" onClick={handleSubmit(handleSaveRoutine)}>
              Guardar rutina
            </Button>
            <Button
              type="button"
              onClick={handleClearRoutine}
              className="bg-red-800 hover:bg-red-700 active:bg-red-900"
            >
              Limpiar rutina
            </Button>
            <Button type="button" onClick={handleSeeRoutine}>
              Ver rutina
            </Button>
          </div>
        </div>

        <div className="w-px bg-gray-800 shrink-0 self-stretch shadow-lg" />

        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-row items-center gap-5 mb-4">
            <SelectInput
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="Filtrar por categoría"
              className="bg-gray-900 border-none w-56 mt-1 ml-1"
            />
            {selectedCategory === "Fuerza" && (
              <SelectInput
                id="muscle-filter"
                value={selectedMuscle}
                onChange={handleMuscleChange}
                options={muscleOptions}
                placeholder="Filtrar por músculo"
                className="bg-gray-900 border-none w-56 mt-1"
              />
            )}
            {!selectedDay && (
              <p className="text-red-600 text-sm">
                Seleccioná un día para poder agregar ejercicios
              </p>
            )}
          </div>

          <div className="flex flex-col mt-4">
            <BigTitle className="text-xl self-start ml-6">Locales</BigTitle>
            <RoutineCatalogField
              exercises={filteredExercises}
              onAdd={handleAddFromCatalog}
              className={{
                layout: "ml-6",
                errorMessage: "ml-6",
                emptyMessage: "ml-6",
              }}
            />
          </div>
          <div className="flex flex-col mt-14">
            <BigTitle className="text-xl self-start ml-6">Externos</BigTitle>
            <RoutineCatalogField
              exercises={apiCatalog}
              onAdd={handleAddFromCatalog}
              loading={loading}
              error={error}
              className={{
                layout: "ml-6",
                errorMessage: "ml-6",
                emptyMessage: "ml-6",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
