import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  catalogExerciseSchema,
  CatalogExerciseFormData,
} from "./schema/catalogSchema";
import TextInput from "../../../components/Form/Input/TextInput";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { useCatalog } from "../../../context/CatalogContext";

const categoryOptions = [
  { id: "Cardio", displayName: "Cardio" },
  { id: "Fuerza", displayName: "Fuerza" },
  { id: "Flexibilidad", displayName: "Flexibilidad" },
];

export default function RegisterCatalogExercise() {
  const { catalog, addExercise } = useCatalog();
  const { control, handleSubmit, reset } = useForm<CatalogExerciseFormData>({
    resolver: zodResolver(catalogExerciseSchema),
  });

  function onSubmit(data: CatalogExerciseFormData) {
    addExercise({ ...data, id: catalog.length + 1 });
    reset();
  }

  return (
    <section className="bg-linear-to-bl from-black to-green-900 min-h-dvh grid place-items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-white bg-gray-950 flex flex-col items-center gap-5 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800 animate-slide-up-fade"
      >
        <h2 className="text-2xl font-bold text-white self-center">
          Registrar ejercicio al catálogo
        </h2>

        <Controller
          name="exerciseName"
          control={control}
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="exerciseName" className="text-sm text-gray-400">
                Nombre del ejercicio
              </label>
              <TextInput
                id="exerciseName"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Ej: Press de banca"
              />
            </div>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="category" className="text-sm text-gray-400">
                Categoría
              </label>
              <SelectInput
                id="category"
                value={field.value ?? ""}
                options={categoryOptions}
                onChange={field.onChange}
                placeholder="Seleccionar categoría"
              />
            </div>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="description" className="text-sm text-gray-400">
                Descripción
              </label>
              <TextInput
                id="description"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Ej: Ejercicio compuesto para pecho y tríceps"
              />
            </div>
          )}
        />

        <button
          type="submit"
          className="w-full bg-green-800 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg py-2.5 transition cursor-pointer mt-2"
        >
          Guardar en catálogo
        </button>
      </form>
    </section>
  );
}
