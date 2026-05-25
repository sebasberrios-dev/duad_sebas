import { Control } from "react-hook-form";
export declare function NameField<T extends {
    name: string;
}>({ control, }: {
    control: Control<T>;
}): import("react/jsx-runtime").JSX.Element;
export declare function AgeField<T extends {
    age: number;
}>({ control, }: {
    control: Control<T>;
}): import("react/jsx-runtime").JSX.Element;
export declare function EmailField<T extends {
    email: string;
}>({ control, }: {
    control: Control<T>;
}): import("react/jsx-runtime").JSX.Element;
