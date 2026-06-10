import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { AppUser, User, Coach, Admin, Routine } from "../types/interfaces";
import { appUserStorageSchema } from "./schema/user-context-schema";
import { routineStorageSchema } from "./schema/routine-context-schema";
import { storedCatalogSchema } from "./schema/catalog-context-schema";
import { UserContextValue } from "./types/user-context-types";
import { RoutineContextValue } from "./types/routine-context-types";
import {
  CatalogContextValue,
  ExternalFilter,
} from "./types/catalog-context-types";
import { useStoredList } from "./utils/user-context-utils";
import { AppStoreValue } from "./types/app-store-types";
import { CatalogExercise } from "../features/catalog-exercise/types/catalog-exercise.types";
import {
  getExternalExercisesByMuscle,
  getExternalExercisesByType,
} from "../features/catalog-exercise/services/externalExerciseApi";

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const usersStore = useStoredList<AppUser>(
    "fit-tracker-users",
    z.array(appUserStorageSchema),
  );
  const routinesStore = useStoredList<Routine>(
    "fit-tracker-routines",
    z.array(routineStorageSchema),
  );
  const catalogStore = useStoredList<CatalogExercise>(
    "fit-tracker-catalog",
    storedCatalogSchema,
  );

  const users = usersStore.items.filter((u): u is User => u.role === "User");
  const coachs = usersStore.items.filter((u): u is Coach => u.role === "Coach");
  const admins = usersStore.items.filter((u): u is Admin => u.role === "Admin");

  const [apiCatalog, setApiCatalog] = useState<CatalogExercise[]>([]);
  const [externalFilter, setExternalFilter] = useState<ExternalFilter | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
    const alreadyExists = catalogStore.items.some(
      (ex) =>
        ex.exerciseName.toLowerCase() === exercise.exerciseName.toLowerCase(),
    );
    if (alreadyExists) return;
    const source = fromApi ? ("api" as const) : ("local" as const);
    catalogStore.add({ ...exercise, id: Date.now(), source });
  }

  return (
    <AppStoreContext.Provider
      value={{
        users: {
          users,
          coachs,
          admins,
          add: usersStore.add,
          replace: usersStore.replace,
          deleteById: usersStore.deleteById,
          findById: usersStore.findById,
        },
        routines: {
          routines: routinesStore.items,
          addRoutine: routinesStore.add,
          replaceRoutine: routinesStore.replace,
          deleteRoutineById: routinesStore.deleteById,
          findRoutineById: routinesStore.findById,
        },
        catalog: {
          catalog: catalogStore.items,
          apiCatalog,
          loading,
          error,
          addExercise,
          getMuscle: (muscle) =>
            setExternalFilter({ kind: "muscle", value: muscle.toLowerCase() }),
          getType: (type) =>
            setExternalFilter({ kind: "type", value: type.toLowerCase() }),
        },
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}

export function useUsers(): UserContextValue {
  return useAppStore().users;
}

export function useRoutines(): RoutineContextValue {
  return useAppStore().routines;
}

export function useCatalog(): CatalogContextValue {
  return useAppStore().catalog;
}
