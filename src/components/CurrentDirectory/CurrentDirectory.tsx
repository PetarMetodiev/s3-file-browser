import "./CurrentDirectory.css";

type CurrentDirectoryProps = {
  className?: string;
};

export const CurrentDirectory = ({ className }: CurrentDirectoryProps) => {
  return <div className={`current-directory-inner ${className || ""}`}></div>;
};
