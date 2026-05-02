import { Control, Controller } from "react-hook-form";
import { useUsers } from "../../../context/UserContext";
import SelectInput from "../../../components/Form/Input/SelectInput";
import { assignCoachFormData } from "../schema/assignCoachSchema";
import { FieldContainer } from "../../../components/Form/FieldContainer";
import { FormLabel } from "../../../components/Form/FormLabel";

export function CoachsField({
  control,
}: {
  control: Control<assignCoachFormData>;
}) {
  const { coachs } = useUsers();
  const coachsOptions = coachs.map((coach) => ({
    id: String(coach.id),
    displayName: coach.name,
  }));

  return (
    <Controller
      name="coachId"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="coachId">Coach</FormLabel>
          <SelectInput
            id="coachId"
            value={String(field.value ?? "")}
            options={coachsOptions}
            onChange={(val) => field.onChange(Number(val))}
            placeholder="Seleccione el coach"
          />
        </FieldContainer>
      )}
    />
  );
}
