import { Control } from "react-hook-form";
import { loginUserFormData } from "../schema/userSchema";
import { EmailField } from "../../generalFields";

export default function LoginUserFields({
  control,
}: {
  control: Control<loginUserFormData>;
}) {
  return (
    <>
      <EmailField control={control} />
    </>
  );
}
