import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import SelectInput from "../../components/Form/Input/SelectInput";
import { BigTitle } from "../../components/Title/BigTitle";
import { Button } from "../../components/Button/Button";
import { useCatalog } from "../../context/CatalogContext";
import { useSession } from "../../context/SessionContext";
import ExercisesCatalogField from "../../features/catalog/fields/ExercisesCatalogField";
import { muscleOptions } from "../../features/catalog-exercise/types/options";
import { CatalogExercise } from "../../features/catalog-exercise/types/catalog-exercise.types";
import { generateCatalogReport } from "../../utils/catalog-report";
import { printCatalogReport } from "../../utils/console";
import { categoryOptions } from "../../features/catalog-exercise/types/options";
import { categoryToApiType } from "../../features/catalog/types/catalog-types";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");

  const {
    catalog: localExercises,
    apiCatalog: externalExercises,
    error,
    loading,
    getMuscle,
    getType,
    addExercise,
  } = useCatalog();
  const { currentUser, isAdmin, isCoach } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || (!isAdmin(currentUser) && !isCoach(currentUser))) {
      navigate("/login", { replace: true });
    }
  }, [currentUser]);

  if (!currentUser || (!isAdmin(currentUser) && !isCoach(currentUser))) return null;

  const isAdminUser = !!currentUser && isAdmin(currentUser);

  const availableExternalExercises = externalExercises.filter(
    (api) =>
      !localExercises.some(
        (local) =>
          local.exerciseName.toLowerCase() === api.exerciseName.toLowerCase(),
      ),
  );

  const filteredLocalExercises = localExercises.filter((e) => {
    const matchesCategory = selectedCategory
      ? e.category === selectedCategory
      : true;
    const matchesMuscle = selectedMuscle ? e.muscle === selectedMuscle : true;
    return matchesCategory && matchesMuscle;
  });

  function handleAddExternalExercise(exercise: CatalogExercise) {
    addExercise(
      {
        exerciseName: exercise.exerciseName,
        category: exercise.category,
        muscle: exercise.muscle,
        description: exercise.description,
      },
      true,
    );
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedMuscle("");
    if (isAdminUser) getType(categoryToApiType[category]);
  }

  function handleMuscleChange(muscle: string) {
    setSelectedMuscle(muscle);
    if (isAdminUser) getMuscle(muscle);
  }

  function handleGenerateReport() {
    const filter = selectedMuscle
      ? { kind: "muscle" as const, value: selectedMuscle }
      : selectedCategory
        ? { kind: "type" as const, value: categoryToApiType[selectedCategory] }
        : undefined;

    const report = generateCatalogReport(localExercises);
    printCatalogReport(report, filter);
  }

  return (
    <div className="p-8 w-full h-full mt-7 animate-slide-up-fade">
      <div className="flex flex-row justify-center items-center gap-4">
        <SelectInput
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          className="bg-gray-900 border-none w-56"
        />
        {selectedCategory === "Fuerza" && (
          <SelectInput
            id="muscle-filter"
            value={selectedMuscle}
            onChange={handleMuscleChange}
            options={muscleOptions}
            placeholder="Selecciona un músculo"
            className="bg-gray-900 border-none w-56"
          />
        )}
        <BigTitle className="text-center">Catálogo de ejercicios</BigTitle>
      </div>
      {isAdminUser && availableExternalExercises.length > 0 && (
        <div className="flex justify-start ml-26 mt-6">
          <Button
            type="button"
            onClick={handleGenerateReport}
            className="w-auto px-7 py-3  mt-0"
          >
            Generar reporte
          </Button>
        </div>
      )}
      <div className="flex flex-col mt-6">
        <ExercisesCatalogField exercises={filteredLocalExercises} />
      </div>
      {isAdminUser && (
        <div className="flex flex-col mt-14">
          <BigTitle className="text-xl ml-26 self-start">
            API Exercises
          </BigTitle>
          <ExercisesCatalogField
            exercises={availableExternalExercises}
            error={error}
            loading={loading}
            onAdd={handleAddExternalExercise}
          />
        </div>
      )}
    </div>
  );
}
