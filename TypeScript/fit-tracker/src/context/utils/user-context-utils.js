import { useState, useRef } from "react";
import { EntityStore } from "./EntityStore";
export function useStoredList(storageKey, schema) {
    const storeRef = useRef(null);
    function getStore() {
        if (storeRef.current)
            return storeRef.current;
        const store = new EntityStore();
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const result = schema.safeParse(JSON.parse(stored));
                if (result.success) {
                    result.data.forEach((item) => store.add(item));
                }
            }
        }
        catch { }
        storeRef.current = store;
        return store;
    }
    const [items, setItems] = useState(() => getStore().getAll());
    function sync() {
        const updated = getStore().getAll();
        setItems(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    function findBy(predicate) {
        return getStore().findBy(predicate);
    }
    return {
        items,
        add: (item) => {
            getStore().add(item);
            sync();
        },
        replace: (entity) => {
            getStore().replace(entity);
            sync();
        },
        update: (id, partial) => {
            getStore().update(id, partial);
            sync();
        },
        deleteById: (id) => {
            getStore().deleteById(id);
            sync();
        },
        findById: (id) => getStore().findById(id),
        findBy,
    };
}
