import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import "./FilePreview.css";
import { useContext, useEffect, useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

export const FilePreview = () => {
  const {
    fileContents,
    isLoading,
    isNewFileInputVisible,
    isNewDirectoryInputVisible,
    createDirectory,
    uploadFile,
    selectedPath,
    displayPath,
    networkError,
  } = useContext(FileContentsContext);

  const [newDirectory, setNewDirectory] = useState("");
  const [directoryNameError, setDirectoryNameError] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileNameError, setFileNameError] = useState(false);
  const [newFileContent, setNewFileContent] = useState("");

  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    console.log(networkError);
    if (!isNewFileInputVisible && !isNewDirectoryInputVisible) {
      if (isLoading) {
        setDisplayMessage("Loading...");
      } else if (networkError.name || networkError.message) {
        setDisplayMessage(`${networkError.name}: ${networkError.message}`);
      } else if (fileContents) {
        setDisplayMessage(fileContents);
      } else {
        setDisplayMessage("Click on a file to see its content");
      }
    }
  }, [
    isNewFileInputVisible,
    isNewDirectoryInputVisible,
    networkError,
    isLoading,
    fileContents,
  ]);

  return (
    <div className="file-preview">
      <div data-titlebar>{displayPath && `File: ${displayPath}`}</div>
      <div data-main-content>
        {!isLoading && isNewDirectoryInputVisible && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newDirectory.includes("/")) {
                setDirectoryNameError(true);
              } else {
                setDirectoryNameError(false);
                createDirectory({
                  directoryName: newDirectory,
                  path: selectedPath,
                }).then(() => setNewDirectory(""));
              }
            }}
          >
            <Input
              label="Enter new directory name(min 3 chars, no / allowed)"
              onChange={setNewDirectory}
              value={newDirectory}
              required
              minlength={3}
            />
            <Button>Create</Button>
            {directoryNameError && <span>No /(slash) symbols allowed.</span>}
          </form>
        )}
        {/* TODO: Fix loading indicator*/}
        {!isLoading && isNewFileInputVisible && (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (newFileName.includes("/")) {
                setFileNameError(true);
              } else {
                setFileNameError(false);
                uploadFile({
                  content: newFileContent,
                  fileName: newFileName,
                  path: selectedPath,
                }).then(() => {
                  setNewFileName("");
                  setNewFileContent("");
                });
              }
            }}
          >
            <Input
              label="Enter new file name(min 3 chars)"
              onChange={setNewFileName}
              value={newFileName}
              required
              minlength={3}
            />
            <Input
              label="Enter contents(min 3 chars)"
              onChange={setNewFileContent}
              value={newFileContent}
              required
              minlength={3}
            />
            <Button>Upload</Button>
            {fileNameError && <span>No /(slash) symbols allowed.</span>}
          </form>
        )}
        {displayMessage}
      </div>
    </div>
  );
};
