import z from "zod";
export declare function useStoredList<T extends {
    id: number;
}>(storageKey: string, schema: z.ZodType<T[]>): {
    items: T[];
    add: (item: T) => void;
    replace: (entity: T) => void;
    update: (id: number, partial: Partial<Omit<T, "id">>) => void;
    deleteById: (id: number) => void;
    findById: (id: number) => T | undefined;
    findBy: (predicate: (entity: T) => boolean) => T[];
};
