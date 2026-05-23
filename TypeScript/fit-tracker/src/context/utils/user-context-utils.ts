import z from "zod";
import { useState } from "react";

export function useStoredList<T extends { id: number }>(
  storageKey: string,
  schema: z.ZodType<T[]>,
) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      const result = schema.safeParse(JSON.parse(stored));
      return result.success ? result.data : [];
    } catch {
      return [];
    }
  });

  function save(updated: T[]) {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  return {
    items,
    add: (item: T) => save([...items, item]),
    update: (item: T) => save(items.map((i) => (i.id === item.id ? item : i))),
  };
}
