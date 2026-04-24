import { Controller, Control } from "react-hook-form";
import { loginUserFormData } from "../schema/userSchema";
import TextInput from "../../../components/Form/Input/TextInput";

export default function LoginUserFields({
  control,
}: {
  control: Control<loginUserFormData>;
}) {
  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-gray-400">
              <TextInput
                id="name"
                type="text"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Nombre"
              />
            </label>
          </div>
        )}
      />
    </>
  );
}
