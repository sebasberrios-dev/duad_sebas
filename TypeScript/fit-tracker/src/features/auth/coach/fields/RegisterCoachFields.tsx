import { Controller, Control } from "react-hook-form";
import { registerCoachFormData } from "../schema/coachSchema";
import { NameField, AgeField, EmailField } from "../../generalFields";
import SelectInput from "../../../../components/Form/Input/SelectInput";
import { FieldContainer } from "../../../../components/Form/FieldContainer";
import { FormLabel } from "../../../../components/Form/FormLabel";

const experienceOptions = [
  { id: "junior", displayName: "Junior" },
  { id: "intermediate", displayName: "Intermedio" },
  { id: "senior", displayName: "Senior" },
  { id: "expert", displayName: "Experto" },
];

export function CoachExperienceField({
  control,
}: {
  control: Control<registerCoachFormData>;
}) {
  return (
    <Controller
      name="experience"
      control={control}
      render={({ field }) => (
        <FieldContainer>
          <FormLabel htmlFor="experience">
            <SelectInput
              id="experience"
              value={field.value ?? ""}
              onChange={field.onChange}
              options={experienceOptions}
              placeholder="Seleccione su experiencia como coach"
            />
          </FormLabel>
        </FieldContainer>
      )}
    />
  );
}

export default function RegisterCoachFields({
  control,
}: {
  control: Control<registerCoachFormData>;
}) {
  return (
    <>
      <NameField control={control} />
      <AgeField control={control} />
      <EmailField control={control} />
      <CoachExperienceField control={control} />
    </>
  );
}
