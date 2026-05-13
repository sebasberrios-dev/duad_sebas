import { useForm, DefaultValues } from "react-hook-form";
import { Exercise } from "../../types/interfaces";
import { CatalogExercise } from "../catalog-exercise/types/catalog-exercise.types";
import { Days } from "../../types/types";
import { ExerciseFormData, exerciseSchema } from "./schema/exerciseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CardioFields from "./fields/CardioFields";
import StrengthFields from "./fields/StrengthFields";
import FlexFields from "./fields/FlexFields";
import ExerciseBaseFields from "./fields/ExerciseBaseFields";
import { useCatalog } from "../../context/CatalogContext";
import { FormContainer } from "../../components/Container/FormContainer";
import { FormTitle } from "../../components/Title/FormTitle";
import RegisterExerciseFields from "./fields/RegisterExerciseFields";
import { Button } from "../../components/Button/Button";
import CompleteField from "./fields/CompleteField";

interface Props {
  day: Days;
  preloaded?: CatalogExercise;
  onSuccess: (exercise: Exercise) => void;
}

export default function RegisterExercise({ day, preloaded, onSuccess }: Props) {
  const { catalog } = useCatalog();
  const catalogOptions = catalog.map((e) => ({
    id: String(e.id),
    displayName: e.exerciseName,
  }));
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<ExerciseFormData>({
      resolver: zodResolver(exerciseSchema),
      defaultValues: preloaded
        ? ({
            catalogExerciseId: preloaded.id,
            exerciseName: preloaded.exerciseName,
            category: preloaded.category,
          } as DefaultValues<ExerciseFormData>)
        : undefined,
    });
  const category = watch("category");

  function onSubmit(data: ExerciseFormData) {
    let details: Exercise["details"];

    if (data.category === "Cardio") {
      details = { category: "Cardio", ...data.details };
    } else if (data.category === "Fuerza") {
      details = { category: "Fuerza", ...data.details };
    } else {
      details = { category: "Flexibilidad", ...data.details };
    }

    const newExercise: Exercise = {
      id: Date.now(),
      exerciseName: data.exerciseName,
      durationMinutes: data.durationMinutes,
      complete: data.complete,
      details,
    };

    onSuccess(newExercise);
    reset();
  }

  function handleRest() {
    const restExercise: Exercise = {
      id: Date.now(),
      exerciseName: "Descanso",
      durationMinutes: 0,
      complete: false,
      details: { category: "Descanso" },
    };
    onSuccess(restExercise);
    reset();
  }

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)} className="border-0">
      <FormTitle>
        {preloaded ? preloaded.exerciseName : `Sesión de ${day.toLowerCase()}`}
      </FormTitle>
      {!preloaded && (
        <RegisterExerciseFields
          control={control}
          catalogOptions={catalogOptions}
          setValue={setValue}
        />
      )}
      <ExerciseBaseFields control={control} />

      {category === "Cardio" && <CardioFields control={control} />}
      {category === "Fuerza" && <StrengthFields control={control} />}
      {category === "Flexibilidad" && <FlexFields control={control} />}
      <CompleteField control={control} />
      <Button type="submit">Guardar ejercicio</Button>
      {!preloaded && (
        <Button
          type="button"
          onClick={handleRest}
          className="bg-red-700 hover:bg-red-600 active:bg-red-800"
        >
          Marcar como descanso
        </Button>
      )}
    </FormContainer>
  );
}
