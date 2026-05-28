import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getExternalExercisesByMuscle, getExternalExercisesByType, } from "../features/catalog-exercise/services/externalExerciseApi";
import { loadCatalog, saveCatalog } from "./utils/catalog-context-utils";
import { EntityStore } from "./utils/EntityStore";
const CatalogContext = createContext(null);
export function CatalogProvider({ children }) {
    const storeRef = useRef(new EntityStore());
    const [catalog, setCatalog] = useState(() => {
        const loaded = loadCatalog();
        loaded.forEach((ex) => storeRef.current.add(ex));
        return storeRef.current.getAll();
    });
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
        const alreadyExists = storeRef.current.findBy((ex) => ex.exerciseName.toLowerCase() === exercise.exerciseName.toLowerCase()).length > 0;
        if (alreadyExists)
            return;
        const source = fromApi ? "api" : "local";
        storeRef.current.add({ ...exercise, id: Date.now(), source });
        const updated = storeRef.current.getAll();
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
