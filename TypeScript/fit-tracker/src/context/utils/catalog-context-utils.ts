import { CatalogExercise } from "../../features/catalog-exercise/types/catalog-exercise.types";
import { storedCatalogSchema } from "../schema/catalog-context-schema";

const STORAGE_KEY = "fit-tracker-catalog";

export function loadCatalog(): CatalogExercise[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    const result = storedCatalogSchema.safeParse(parsed);
    if (!result.success) return [];
    return result.data.map((ex) => ({ ...ex, source: "local" as const }));
  } catch {
    // si el JSON está corrupto, retornamos lista vacía
  }
  return [];
}

export function saveCatalog(catalog: CatalogExercise[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
}
