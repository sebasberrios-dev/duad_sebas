export interface ButtonProps {
    children: React.ReactNode;
    type: "submit" | "reset" | "button" | undefined;
    onClick?: () => void;
    className?: string;
}
