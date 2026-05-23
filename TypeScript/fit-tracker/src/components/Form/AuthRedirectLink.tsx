import { AuthRedirectProps } from "./form-props";

export function AuthRedirectLink({
  prompt,
  linkText,
  onClick,
}: AuthRedirectProps) {
  return (
    <div className="flex flex-row gap-2">
      <span>{prompt}</span>
      <button
        type="button"
        onClick={onClick}
        className="text-violet-300 underline cursor-pointer"
      >
        {linkText}
      </button>
    </div>
  );
}
