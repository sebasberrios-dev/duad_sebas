import { useState } from "react";
import SelectInput from "../../components/Form/Input/SelectInput";
import { BigTitle } from "../../components/Title/BigTitle";
import { useCatalog } from "../../context/CatalogContext";
import ExercisesCatalogField from "../../features/catalog/fields/ExercisesCatalogField";
import { muscleOptions } from "../../features/catalog-exercise/types/muscle-options";

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

export default function Catalog() {
  const {
    catalog: localExercises,
    apiCatalog: externalExercises,
    error,
    loading,
    getMuscle,
    getType,
  } = useCatalog();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);
    setSelectedMuscle("");
    getType(categoryToApiType[category]);
  }

  function handleMuscleChange(muscle: string) {
    setSelectedMuscle(muscle);
    getMuscle(muscle);
  }

  const filteredLocalExercises = localExercises.filter((e) => {
    const matchesCategory = selectedCategory ? e.category === selectedCategory : true;
    const matchesMuscle = selectedMuscle ? e.muscle === selectedMuscle : true;
    return matchesCategory && matchesMuscle;
  });

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
      <div className="flex flex-col mt-14">
        <BigTitle className="text-xl ml-26 self-start">Locales</BigTitle>
        <ExercisesCatalogField exercises={filteredLocalExercises} />
      </div>
      <div className="flex flex-col mt-14">
        <BigTitle className="text-xl ml-26 self-start">Externos</BigTitle>
        <ExercisesCatalogField
          exercises={externalExercises}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
}
