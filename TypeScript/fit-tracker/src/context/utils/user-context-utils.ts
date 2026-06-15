import z from "zod";
import { useState, useRef } from "react";
import { EntityStore } from "./EntityStore";

export function useStoredList<T extends { id: number }>(
  storageKey: string,
  schema: z.ZodType<T[]>,
) {
  const storeRef = useRef<EntityStore<T> | null>(null);

  function getStore(): EntityStore<T> {
    if (storeRef.current) return storeRef.current;
    const store = new EntityStore<T>();
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const result = schema.safeParse(JSON.parse(stored));
        if (result.success) {
          result.data.forEach((item) => store.add(item));
        }
      }
    } catch {}
    storeRef.current = store;
    return store;
  }

  const [items, setItems] = useState<T[]>(() => getStore().getAll());

  function sync() {
    const updated = getStore().getAll();
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  function findBy(predicate: (entity: T) => boolean): T[] {
    return getStore().findBy(predicate);
  }

  return {
    items,
    add: (item: T) => {
      getStore().add(item);
      sync();
    },
    replace: (entity: T) => {
      getStore().replace(entity);
      sync();
    },
    update: (id: number, partial: Partial<Omit<T, "id">>) => {
      getStore().update(id, partial);
      sync();
    },
    deleteById: (id: number) => {
      getStore().deleteById(id);
      sync();
    },
    findById: (id: number): T | undefined => getStore().findById(id),
    findBy,
  };
}