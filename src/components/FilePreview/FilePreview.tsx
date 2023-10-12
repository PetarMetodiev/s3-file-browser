import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import "./FilePreview.css";
import { useContext, useState } from "react";
import { Input } from "../form-controls/Input/Input";
import { Button } from "../form-controls/Button/Button";

export const FilePreview = () => {
  const {
    fileContents,
    isLoading,
    objectKeys,
    isNewFileInputVisible,
    isNewDirectoryInputVisible,
    createDirectory,
    uploadFile,
    deleteAllObjects,
    selectedPath,
  } = useContext(FileContentsContext);

  const [newDirectory, setNewDirectory] = useState("");
  const [directoryNameError, setDirectoryNameError] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileNameError, setFileNameError] = useState(false);
  const [newFileContent, setNewFileContent] = useState("");

  return (
    <div className="file-preview">
      {selectedPath}
      {/* TODO: remove*/}
      <Button onClick={deleteAllObjects}>Delete all</Button>
      {isNewDirectoryInputVisible && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newDirectory.includes("/")) {
              setDirectoryNameError(true);
            } else {
              createDirectory({
                directoryName: newDirectory,
                path: selectedPath,
              });
              setDirectoryNameError(false);
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
      {isNewFileInputVisible && (
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
      {!isNewFileInputVisible && !isNewDirectoryInputVisible
        ? isLoading
          ? "loading..."
          : !objectKeys
          ? "Create a directory or a file"
          : fileContents
        : ""}
    </div>
  );
};
