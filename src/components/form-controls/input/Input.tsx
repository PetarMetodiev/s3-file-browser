import { useGeneratedId } from "../../../hooks/useGenerateId";
import "./Input.css";

type InputProps = {
  label: string;
  onChange: (v: string) => void;
  value: string;
  required?: boolean;
  className?: string;
};

export const Input = ({
  label,
  onChange,
  value,
  required,
  className,
}: InputProps) => {
  const id = useGeneratedId();

  return (
    <div className={`input-container ${className}`}>
      <label htmlFor={id} data-label>
        {label}:
      </label>
      <input
        data-input
        id={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
