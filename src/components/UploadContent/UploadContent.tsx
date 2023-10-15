import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { useContext, useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

import "./UploadContent.css";

export const UploadContent = () => {
  const [newDirectory, setNewDirectory] = useState("");
  const [directoryNameError, setDirectoryNameError] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileNameError, setFileNameError] = useState(false);
  const [newFileContent, setNewFileContent] = useState("");

  const {
    isNewFileInputVisible,
    isNewDirectoryInputVisible,
    createDirectory,
    uploadFile,
    currentDirectory,
  } = useContext(FileContentsContext);

  return (
    <div className="upload-content">
      {isNewDirectoryInputVisible && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newDirectory.includes("/")) {
              setDirectoryNameError(true);
            } else {
              setDirectoryNameError(false);
              createDirectory({
                directoryName: newDirectory,
                path: currentDirectory,
              }).then(() => setNewDirectory(""));
            }
          }}
        >
          <Input
            label="Enter new directory name(min 3 chars, no / allowed)"
            className="form-input"
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
              console.log({ selectedPath: currentDirectory });
              uploadFile({
                content: newFileContent,
                fileName: newFileName,
                path: currentDirectory,
              }).then(() => {
                setNewFileName("");
                setNewFileContent("");
              });
            }
          }}
        >
          <Input
            label="Enter new file name(min 3 chars)"
            className="form-input"
            onChange={setNewFileName}
            value={newFileName}
            required
            minlength={3}
          />
          <Input
            label="Enter contents(min 3 chars)"
            className="form-input"
            onChange={setNewFileContent}
            value={newFileContent}
            required
            minlength={3}
          />
          <Button>Upload</Button>
          {fileNameError && <span>No /(slash) symbols allowed.</span>}
        </form>
      )}
    </div>
  );
};
