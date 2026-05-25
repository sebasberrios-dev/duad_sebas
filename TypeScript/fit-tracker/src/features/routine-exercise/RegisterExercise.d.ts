import { Exercise } from "../../types/interfaces";
import { CatalogExercise } from "../catalog-exercise/types/catalog-exercise.types";
import { Days } from "../../types/types";
interface Props {
    day: Days;
    preloaded?: CatalogExercise;
    onSuccess: (exercise: Exercise) => void;
}
export default function RegisterExercise({ day, preloaded, onSuccess }: Props): import("react/jsx-runtime").JSX.Element;
export {};
