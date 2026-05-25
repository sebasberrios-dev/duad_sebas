import { useState } from "react";
export function useStoredList(storageKey, schema) {
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored)
                return [];
            const result = schema.safeParse(JSON.parse(stored));
            return result.success ? result.data : [];
        }
        catch {
            return [];
        }
    });
    function save(updated) {
        setItems(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    return {
        items,
        add: (item) => save([...items, item]),
        update: (item) => save(items.map((i) => (i.id === item.id ? item : i))),
    };
}
