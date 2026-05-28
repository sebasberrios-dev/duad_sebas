export declare class EntityStore<T extends {
    id: number;
}> {
    private items;
    add(entity: T): void;
    getAll(): T[];
    findById(id: number): T | undefined;
    deleteById(id: number): boolean;
    update(id: number, partial: Partial<Omit<T, "id">>): T | undefined;
    findBy(predicate: (entity: T) => boolean): T[];
}
