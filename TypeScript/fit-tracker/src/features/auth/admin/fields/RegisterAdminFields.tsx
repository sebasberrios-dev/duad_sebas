import { Control } from "react-hook-form";
import { registerAdminFormData } from "../schema/adminSchema";
import { NameField, AgeField, EmailField } from "../../generalFields";

export default function RegisterAdminFields({
  control,
}: {
  control: Control<registerAdminFormData>;
}) {
  return (
    <>
      <NameField control={control} />
      <AgeField control={control} />
      <EmailField control={control} />
    </>
  );
}
