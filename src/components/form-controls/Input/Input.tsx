import { ReactNode, useId } from "react";
import "./Input.css";

type InputProps = {
  label: ReactNode;
  onChange: (v: string) => void;
  value: string;
  required?: boolean;
  minlength?: number;
  className?: string;
};

export const Input = ({
  label,
  onChange,
  value,
  required,
  minlength,
  className,
}: InputProps) => {
  const id = useId();

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
        minLength={minlength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
