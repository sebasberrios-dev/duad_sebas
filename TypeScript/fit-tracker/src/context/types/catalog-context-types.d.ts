import { CatalogExercise } from "../../features/catalog-exercise/types/catalog-exercise.types";
export type ExternalFilter = {
    kind: "muscle";
    value: string;
} | {
    kind: "type";
    value: string;
};
export interface CatalogContextValue {
    catalog: CatalogExercise[];
    apiCatalog: CatalogExercise[];
    loading: boolean;
    error: boolean;
    addExercise: (exercise: Omit<CatalogExercise, "id" | "source">, fromApi?: boolean) => void;
    getMuscle: (muscle: string) => void;
    getType: (type: string) => void;
}
