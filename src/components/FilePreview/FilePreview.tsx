import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import "./FilePreview.css";
import { useContext, useEffect, useState } from "react";
import { UploadContent } from "../UploadContent/UploadContent";

type FilePreviewProps = {
  className?: string;
};

export const FilePreview = ({ className }: FilePreviewProps) => {
  const {
    fileContents,
    isLoading,
    currentFile,
    isNewFileInputVisible,
    isNewDirectoryInputVisible,
  } = useContext(FileContentsContext);

  const [displayMessage, setDisplayMessage] = useState("");
  const showUploadContent = isNewFileInputVisible || isNewDirectoryInputVisible;

  useEffect(() => {
    if (fileContents) {
      setDisplayMessage(fileContents);
    } else {
      setDisplayMessage("Click on a file to see its content");
    }
  }, [isLoading, fileContents]);

  return (
    <div className={`file-preview-inner ${className || ""}`}>
      <h2 data-titlebar>{currentFile}</h2>
      <div data-main-content>
        {/* TODO: Fix loading indicator*/}
        {!isLoading && showUploadContent && <UploadContent />}
        {displayMessage}
      </div>
    </div>
  );
};
