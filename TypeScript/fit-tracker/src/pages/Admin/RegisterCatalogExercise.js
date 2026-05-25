import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { catalogExerciseSchema, } from "../../features/catalog-exercise/schema/catalogSchema";
import RegisterCatalogExerciseFields from "../../features/catalog-exercise/fields/RegisterCatalogExerciseFields";
import { useCatalog } from "../../context/CatalogContext";
import { FormTitle } from "../../components/Title/FormTitle";
import { FormContainer } from "../../components/Container/FormContainer";
import { Button } from "../../components/Button/Button";
export default function RegisterCatalogExercise() {
    const { addExercise } = useCatalog();
    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(catalogExerciseSchema),
    });
    function onSubmit(data) {
        addExercise(data);
        reset();
    }
    return (_jsxs(FormContainer, { onSubmit: handleSubmit(onSubmit), className: "bg-gray-850 shadow-2xl", children: [_jsx(FormTitle, { children: "Registrar ejercicio al cat\u00E1logo" }), _jsx(RegisterCatalogExerciseFields, { control: control }), _jsx(Button, { type: "submit", children: "Guardar en cat\u00E1logo" })] }));
}
