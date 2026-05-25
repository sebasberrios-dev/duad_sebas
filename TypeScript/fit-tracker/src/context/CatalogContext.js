import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import { getExternalExercisesByMuscle, getExternalExercisesByType, } from "../features/catalog-exercise/services/externalExerciseApi";
import { loadCatalog, saveCatalog } from "./utils/catalog-context-utils";
const CatalogContext = createContext(null);
export function CatalogProvider({ children }) {
    const [catalog, setCatalog] = useState(loadCatalog);
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
        const alreadyExists = catalog.some((ex) => ex.exerciseName.toLowerCase() === exercise.exerciseName.toLowerCase());
        if (alreadyExists)
            return;
        const source = fromApi ? "api" : "local";
        const withMeta = { ...exercise, id: Date.now(), source };
        const updated = [...catalog, withMeta];
        setCatalog(updated);
        saveCatalog(updated);
    }
    return (_jsx(CatalogContext.Provider, { value: {
            catalog,
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
