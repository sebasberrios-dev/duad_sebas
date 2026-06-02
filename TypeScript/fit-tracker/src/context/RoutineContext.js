import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
import { z } from "zod";
import { routineStorageSchema } from "./schema/routine-context-schema";
import { useStoredList } from "./utils/user-context-utils";
const RoutineContext = createContext(null);
export function RoutineProvider({ children }) {
    const store = useStoredList("fit-tracker-routines", z.array(routineStorageSchema));
    return (_jsx(RoutineContext.Provider, { value: {
            routines: store.items,
            addRoutine: store.add,
            replaceRoutine: store.replace,
            deleteRoutineById: store.deleteById,
            findRoutineById: store.findById,
        }, children: children }));
}
export function useRoutines() {
    const ctx = useContext(RoutineContext);
    if (!ctx)
        throw new Error("useRoutines must be used inside RoutineProvider");
    return ctx;
}
