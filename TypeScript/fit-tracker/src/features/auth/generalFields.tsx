import { Controller, Control } from "react-hook-form";
import { Path } from "react-hook-form";
import { FieldContainer } from "../../components/Form/FieldContainer";
import { FormLabel } from "../../components/Form/FormLabel";
import TextInput from "../../components/Form/Input/TextInput";

export function NameField<T extends { name: string }>({
  control,
}: {
  control: Control<T>;
}) {
  return (
    <Controller
      name={"name" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FieldContainer>
          <FormLabel htmlFor="name">
            <TextInput
              id="name"
              type="text"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Nombre"
            />
          </FormLabel>
          {fieldState.error && (
            <p className="text-red-500 text-xs">{fieldState.error.message}</p>
          )}
        </FieldContainer>
      )}
    />
  );
}

export function AgeField<T extends { age: number }>({
  control,
}: {
  control: Control<T>;
}) {
  return (
    <Controller
      name={"age" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FieldContainer>
          <FormLabel htmlFor="age">
            <TextInput
              id="age"
              type="number"
              value={field.value ?? ""}
              onChange={(v) => field.onChange(v === "" ? undefined : Number(v))}
              placeholder="Edad"
            />
          </FormLabel>
          {fieldState.error && (
            <p className="text-red-500 text-xs">{fieldState.error.message}</p>
          )}
        </FieldContainer>
      )}
    />
  );
}

export function EmailField<T extends { email: string }>({
  control,
}: {
  control: Control<T>;
}) {
  return (
    <Controller
      name={"email" as Path<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FieldContainer>
          <FormLabel htmlFor="email">
            <TextInput
              id="email"
              type="email"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Correo Electrónico"
            />
          </FormLabel>
          {fieldState.error && (
            <p className="text-red-500 text-xs">{fieldState.error.message}</p>
          )}
        </FieldContainer>
      )}
    />
  );
}
