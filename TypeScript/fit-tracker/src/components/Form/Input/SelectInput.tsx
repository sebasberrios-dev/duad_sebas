export interface Option {
  id: string;
  displayName: string;
  className?: string;
}

interface SelectInputProps {
  id: string;
  value: string;
  onChange: (optionId: Option["id"]) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export default function SelectInput({
  id,
  value,
  onChange,
  options,
  placeholder,
  className,
}: SelectInputProps) {
  return (
    <select
      id={id}
      value={value}
      className={`w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent cursor-pointer transition ${className ?? ""}`}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.id} value={option.id} className={option.className}>
          {option.displayName}
        </option>
      ))}
    </select>
  );
}
