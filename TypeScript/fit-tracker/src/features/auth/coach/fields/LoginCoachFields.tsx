import { Control } from "react-hook-form";
import { loginCoachFormData } from "../schema/coachSchema";
import { EmailField } from "../../generalFields";

export default function LoginCoachFields({
  control,
}: {
  control: Control<loginCoachFormData>;
}) {
  return (
    <>
      <EmailField control={control} />
    </>
  );
}
