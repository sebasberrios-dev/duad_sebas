export interface TextInputProps {
    id: string;
    type?: "text" | "number" | "email";
    value: string | number;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
}
export interface Option {
    id: string;
    displayName: string;
    className?: string;
}
export interface SelectInputProps {
    id: string;
    value: string;
    onChange: (optionId: Option["id"]) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}
export interface AuthRedirectProps {
    prompt: string;
    linkText: string;
    onClick: () => void;
}
export interface FormLabelProps {
    children: React.ReactNode;
    htmlFor: string;
    className?: string;
}
