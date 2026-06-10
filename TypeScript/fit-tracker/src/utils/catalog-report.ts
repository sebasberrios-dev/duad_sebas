import { CatalogExercise } from "../features/catalog-exercise/types/catalog-exercise.types";
import { CatalogReport, CategoryGroup } from "./types";

function deduplicateByName(exercises: CatalogExercise[]): CatalogExercise[] {
  const seen = new Set<string>();
  return exercises.filter((ex) => {
    const key = ex.exerciseName.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function classifyExercises(exercises: CatalogExercise[]) {
  const rejected = exercises.filter((ex) => !ex.exerciseName);
  const remaining = deduplicateByName(
    exercises.filter((ex) => ex.exerciseName),
  );
  const incomplete = remaining.filter((ex) => !ex.category || !ex.description);
  const valid = remaining.filter((ex) => ex.category && ex.description);

  return { valid, incomplete, rejected };
}

export function generateCatalogReport(
  exercises: CatalogExercise[],
): CatalogReport {
  const { valid, incomplete, rejected } = classifyExercises(exercises);

  const categoryMap = new Map<string, CategoryGroup>();
  for (const ex of valid) {
    const cat = ex.category!;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, {
        category: cat,
        count: 0,
        local: 0,
        api: 0,
        exercises: [],
      });
    }
    const group = categoryMap.get(cat)!;
    group.count++;
    group.exercises.push(ex);
    if (ex.source === "local") group.local++;
    else group.api++;
  }
  return {
    generatedAt: new Date().toISOString(),
    totals: {
      total: valid.length,
      local: valid.filter((ex) => ex.source === "local").length,
      api: valid.filter((ex) => ex.source === "api").length,
    },
    byCategory: [...categoryMap.values()],
    incomplete,
    rejected,
  };
}
