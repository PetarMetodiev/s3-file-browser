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
    currentDirectory,
    currentFile,
    isNewFileInputVisible,
    isNewDirectoryInputVisible,
  } = useContext(FileContentsContext);

  const [displayMessage, setDisplayMessage] = useState("");
  const showUploadContent = isNewFileInputVisible || isNewDirectoryInputVisible;

  useEffect(() => {
    if (isLoading) {
      setDisplayMessage("Loading...");
    } else if (fileContents) {
      setDisplayMessage(fileContents);
    } else {
      setDisplayMessage("Click on a file to see its content");
    }
  }, [isLoading, fileContents]);

  return (
    <div className={`file-preview-inner ${className || ""}`}>
      <div data-titlebar>{currentFile && `currentFile: ${currentFile}`}</div>
      <div data-titlebar>
        {currentDirectory && `selectedPath: ${currentDirectory}`}
      </div>
      <div data-main-content>
        {/* TODO: Fix loading indicator*/}
        {!isLoading && showUploadContent && <UploadContent />}
        {displayMessage}
      </div>
    </div>
  );
};
