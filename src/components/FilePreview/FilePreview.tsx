import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { useContext, useEffect, useState } from "react";
import { UploadContent } from "../UploadContent/UploadContent";

import "css.gg/icons/css/file.css";

import "./FilePreview.css";

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

  const [displayMessage, setDisplayMessage] = useState(
    "Click on a file to see its content"
  );
  const showUploadContentForm =
    isNewFileInputVisible || isNewDirectoryInputVisible;

  useEffect(() => {
    if (fileContents) {
      setDisplayMessage(fileContents);
    }
  }, [fileContents]);

  return (
    <div className={`file-preview-inner ${className || ""}`}>
      <h2 data-titlebar>
        {currentFile && (
          <>
            <i className="gg-file"></i>
            currentFile
          </>
        )}
      </h2>
      <div data-main-content>
        {/* TODO: Fix loading indicator*/}
        {!isLoading && showUploadContentForm ? (
          <UploadContent />
        ) : (
          <div data-display-message>{displayMessage}</div>
        )}
      </div>
    </div>
  );
};
