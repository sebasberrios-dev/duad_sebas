import z from "zod";
import { useState, useRef } from "react";
import { EntityStore } from "./EntityStore";

export function useStoredList<T extends { id: number }>(
  storageKey: string,
  schema: z.ZodType<T[]>,
) {
  const storeRef = useRef(new EntityStore<T>());

  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      const result = schema.safeParse(JSON.parse(stored));
      if (!result.success) return [];
      result.data.forEach((item) => storeRef.current.add(item));
      return storeRef.current.getAll();
    } catch {
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
    add: (item: T) => {
      storeRef.current.add(item);
      sync();
    },
    update: (id: number, partial: Partial<Omit<T, "id">>) => {
      storeRef.current.update(id, partial);
      sync();
    },
  };
}
