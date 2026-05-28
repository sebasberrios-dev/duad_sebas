import { useState, useRef } from "react";
import { EntityStore } from "./EntityStore";
export function useStoredList(storageKey, schema) {
    const storeRef = useRef(new EntityStore());
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored)
                return [];
            const result = schema.safeParse(JSON.parse(stored));
            if (!result.success)
                return [];
            result.data.forEach((item) => storeRef.current.add(item));
            return storeRef.current.getAll();
        }
        catch {
            return [];
        }
    });
    function sync() {
        const updated = storeRef.current.getAll();
        setItems(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    return {
        items,
        add: (item) => {
            storeRef.current.add(item);
            sync();
        },
        update: (id, partial) => {
            storeRef.current.update(id, partial);
            sync();
        },
    };
}
