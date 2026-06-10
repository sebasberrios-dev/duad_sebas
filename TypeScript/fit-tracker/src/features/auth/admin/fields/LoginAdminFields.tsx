import { Control } from "react-hook-form";
import { loginAdminFormData } from "../schema/adminSchema";
import { EmailField } from "../../generalFields";

export default function LoginAdminFields({
  control,
}: {
  control: Control<loginAdminFormData>;
}) {
  return (
    <>
      <EmailField control={control} />
    </>
  );
}
