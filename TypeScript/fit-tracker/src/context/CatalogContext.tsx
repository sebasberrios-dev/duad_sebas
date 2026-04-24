import { createContext, useContext, useState } from "react";
import { CatalogExercise } from "../types/interfaces";

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

interface CatalogContextValue {
  catalog: CatalogExercise[];
  addExercise: (exercise: CatalogExercise) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<CatalogExercise[]>(loadCatalog);

  function addExercise(exercise: CatalogExercise) {
    const updated = [...catalog, exercise];
    setCatalog(updated);
    saveCatalog(updated);
  }

  return (
    <CatalogContext.Provider value={{ catalog, addExercise }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}
