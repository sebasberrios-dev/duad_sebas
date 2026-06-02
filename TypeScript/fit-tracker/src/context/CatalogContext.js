import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { getExternalExercisesByMuscle, getExternalExercisesByType, } from "../features/catalog-exercise/services/externalExerciseApi";
import { storedCatalogSchema } from "./schema/catalog-context-schema";
import { useStoredList } from "./utils/user-context-utils";
const CatalogContext = createContext(null);
export function CatalogProvider({ children }) {
    const store = useStoredList("fit-tracker-catalog", storedCatalogSchema);
    const [apiCatalog, setApiCatalog] = useState([]);
    const [externalFilter, setExternalFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    function getMuscle(muscle) {
        setExternalFilter({ kind: "muscle", value: muscle.toLowerCase() });
    }
    function getType(type) {
        setExternalFilter({ kind: "type", value: type.toLowerCase() });
    }
    useEffect(() => {
        if (!externalFilter)
            return;
        setLoading(true);
        setError(false);
        const request = externalFilter.kind === "muscle"
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
    function addExercise(exercise, fromApi = false) {
        if (!exercise.category)
            return;
        const alreadyExists = store.items.some((ex) => ex.exerciseName.toLowerCase() === exercise.exerciseName.toLowerCase());
        if (alreadyExists)
            return;
        const source = fromApi ? "api" : "local";
        store.add({ ...exercise, id: Date.now(), source });
    }
    return (_jsx(CatalogContext.Provider, { value: {
            catalog: store.items,
            apiCatalog,
            loading,
            error,
            addExercise,
            getMuscle,
            getType,
        }, children: children }));
}
export function useCatalog() {
    const ctx = useContext(CatalogContext);
    if (!ctx)
        throw new Error("useCatalog must be used inside CatalogProvider");
    return ctx;
}
