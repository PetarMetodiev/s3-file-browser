import { CurrentDirectory } from "../CurrentDirectory/CurrentDirectory";
import { FilePreview } from "../FilePreview/FilePreview";
import { TreeView } from "../TreeView/TreeView/TreeView";

import "./FileExplorer.css";

export const FileExplorer = () => {
  return (
    <div className="file-explorer">
      <TreeView className="tree-view" />
      <CurrentDirectory className="current-directory" />
      <FilePreview className="file-preview" />
    </div>
  );
};
