import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import "./FilePreview.css";
import { useContext } from "react";

export const FilePreview = () => {
  const { fileContents, isLoading } = useContext(FileContentsContext);
  return (
    <>
      <div className="file-preview">
        {isLoading ? "loading..." : fileContents}
      </div>
    </>
  );
};
