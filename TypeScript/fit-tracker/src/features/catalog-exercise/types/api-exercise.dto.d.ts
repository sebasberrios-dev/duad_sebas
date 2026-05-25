export type ApiType = "strength" | "cardio" | "stretching";
export type ApiDifficulty = "beginner" | "intermediate" | "expert";
export interface ApiCatalogExercise {
    name: string;
    type: ApiType;
    muscle: string;
    difficulty: string;
    instructions: string;
    equipment: string[];
    safety_info: string;
}
