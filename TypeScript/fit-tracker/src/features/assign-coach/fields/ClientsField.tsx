import { Control, Controller } from "react-hook-form";
import { useUsers } from "../../../context/UserContext";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { assignCoachFormData } from "../schema/assignCoachSchema";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";

export function ClientsField({
  control,
}: {
  control: Control<assignCoachFormData>;
}) {
  const { users } = useUsers();
  const clientOptions = users.map((user) => ({
    id: String(user.id),
    displayName: user.name,
  }));

  return (
    <Controller
      name="clientId"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="clientId">Usuario</FormLabel>
          <SelectInput
            id="clientId"
            value={String(field.value ?? "")}
            options={clientOptions}
            onChange={(val) => field.onChange(Number(val))}
            placeholder="Seleccione el usuario"
          />
        </FieldContainer>
      )}
    />
  );
}
