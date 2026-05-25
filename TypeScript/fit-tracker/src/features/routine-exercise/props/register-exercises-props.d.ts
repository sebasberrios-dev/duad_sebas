import { Control } from "react-hook-form";
import { ExerciseFormData } from "../schema/exerciseSchema";
import { UseFormSetValue } from "react-hook-form";
export interface RegisterExerciseProps {
    control: Control<ExerciseFormData>;
    catalogOptions: {
        id: string;
        displayName: string;
    }[];
    setValue: UseFormSetValue<ExerciseFormData>;
}
