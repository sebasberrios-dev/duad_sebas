import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller } from "react-hook-form";
import { FormLabel } from "../../../components/Form/FormLabel";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { useCatalog } from "../../../context/CatalogContext";
import { EXERCISES_CATEGORIES } from "../../../types/types";
export default function RegisterExerciseFields({ control, catalogOptions, setValue, }) {
    const { catalog } = useCatalog();
    function isExerciseCategory(val) {
        return EXERCISES_CATEGORIES.some((cat) => cat === val);
    }
    return (_jsx(Controller, { name: "catalogExerciseId", control: control, render: ({ field }) => (_jsxs(FieldContainer, { children: [_jsx(FormLabel, { htmlFor: "catalogExercise", children: "Ejercicio" }), _jsx(SelectInput, { id: "catalogExercise", value: field.value ? String(field.value) : "", options: catalogOptions, onChange: (id) => {
                        const exercise = catalog.find((e) => e.id === Number(id));
                        if (!exercise)
                            return;
                        field.onChange(Number(id));
                        setValue("exerciseName", exercise.exerciseName);
                        if (isExerciseCategory(exercise.category)) {
                            setValue("category", exercise.category);
                        }
                    }, placeholder: "Seleccionar ejercicio" })] })) }));
}
