import { createContext, useContext } from "react";
import { z } from "zod";
import { Routine } from "../types/interfaces";
import { routineStorageSchema } from "./schema/routine-context-schema";
import { RoutineContextValue } from "./types/routine-context-types";
import { useStoredList } from "./utils/user-context-utils";

const RoutineContext = createContext<RoutineContextValue | null>(null);

export function RoutineProvider({ children }: { children: React.ReactNode }) {
  const store = useStoredList<Routine>(
    "fit-tracker-routines",
    z.array(routineStorageSchema),
  );

  return (
    <RoutineContext.Provider
      value={{
        routines: store.items,
        addRoutine: store.add,
        replaceRoutine: store.replace,
        deleteRoutineById: store.deleteById,
        findRoutineById: store.findById,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutines(): RoutineContextValue {
  const ctx = useContext(RoutineContext);
  if (!ctx) throw new Error("useRoutines must be used inside RoutineProvider");
  return ctx;
}
