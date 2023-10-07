import { MouseEventHandler, PropsWithChildren } from "react";

import "./Button.css";

type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export const Button = ({
  onClick,
  className,
  children,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
