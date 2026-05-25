import z from "zod";
export declare function useStoredList<T extends {
    id: number;
}>(storageKey: string, schema: z.ZodType<T[]>): {
    items: T[];
    add: (item: T) => void;
    update: (item: T) => void;
};
