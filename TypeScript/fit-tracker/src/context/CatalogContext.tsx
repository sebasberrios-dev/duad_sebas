import { createContext, useContext, useEffect, useState } from "react";
import { CatalogExercise } from "../features/catalog-exercise/types/catalog-exercise.types";
import {
  getExternalExercisesByMuscle,
  getExternalExercisesByType,
} from "../features/catalog-exercise/services/externalExerciseApi";
import { storedCatalogSchema } from "./schema/catalog-context-schema";
import {
  ExternalFilter,
  CatalogContextValue,
} from "./types/catalog-context-types";
import { useStoredList } from "./utils/user-context-utils";

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const store = useStoredList<CatalogExercise>(
    "fit-tracker-catalog",
    storedCatalogSchema,
  );

  const [apiCatalog, setApiCatalog] = useState<CatalogExercise[]>([]);
  const [externalFilter, setExternalFilter] = useState<ExternalFilter | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  function getMuscle(muscle: string) {
    setExternalFilter({ kind: "muscle", value: muscle.toLowerCase() });
  }

  function getType(type: string) {
    setExternalFilter({ kind: "type", value: type.toLowerCase() });
  }

  useEffect(() => {
    if (!externalFilter) return;
    setLoading(true);
    setError(false);
    const request =
      externalFilter.kind === "muscle"
        ? getExternalExercisesByMuscle(externalFilter.value)
        : getExternalExercisesByType(externalFilter.value);

    request
      .then((exercises) => setApiCatalog(exercises))
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [externalFilter]);

  function addExercise(
    exercise: Omit<CatalogExercise, "id" | "source">,
    fromApi = false,
  ) {
    if (!exercise.category) return;

    const alreadyExists = store.items.some(
      (ex) =>
        ex.exerciseName.toLowerCase() === exercise.exerciseName.toLowerCase(),
    );
    if (alreadyExists) return;

    const source = fromApi ? ("api" as const) : ("local" as const);
    store.add({ ...exercise, id: Date.now(), source });
  }

  return (
    <CatalogContext.Provider
      value={{
        catalog: store.items,
        apiCatalog,
        loading,
        error,
        addExercise,
        getMuscle,
        getType,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
