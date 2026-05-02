interface Props {
  prompt: string;
  linkText: string;
  onClick: () => void;
}

export function AuthRedirectLink({ prompt, linkText, onClick }: Props) {
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
