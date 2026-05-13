import { createContext, useContext, useEffect, useState } from "react";
import { CatalogExercise } from "../features/catalog-exercise/types/catalog-exercise.types";
import {
  getExternalExercisesByMuscle,
  getExternalExercisesByType,
} from "../features/catalog-exercise/services/externalExerciseApi";

const STORAGE_KEY = "fit-tracker-catalog";

function loadCatalog(): CatalogExercise[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as CatalogExercise[];
  } catch {
    // si el JSON está corrupto, retornamos lista vacía
  }
  return [];
}

function saveCatalog(catalog: CatalogExercise[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
}

type ExternalFilter =
  | { kind: "muscle"; value: string }
  | { kind: "type"; value: string };

interface CatalogContextValue {
  catalog: CatalogExercise[];
  apiCatalog: CatalogExercise[];
  loading: boolean;
  error: boolean;
  addExercise: (exercise: CatalogExercise) => void;
  getMuscle: (muscle: string) => void;
  getType: (type: string) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogExercise[]>(loadCatalog);
  const [apiCatalog, setApiCatalog] = useState<CatalogExercise[]>([]);
  const [externalFilter, setExternalFilter] =
    useState<ExternalFilter | null>(null);
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

  function addExercise(exercise: CatalogExercise) {
    const updated = [...catalog, exercise];
    setCatalog(updated);
    saveCatalog(updated);
  }

  return (
    <CatalogContext.Provider
      value={{ catalog, apiCatalog, loading, error, addExercise, getMuscle, getType }}
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
