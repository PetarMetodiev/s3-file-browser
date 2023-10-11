import { FilePreview } from "../FilePreview/FilePreview";
import { TreeView } from "../TreeView/TreeView/TreeView";

import "./FileExplorer.css";

export const FileExplorer = () => {
  return (
    <div className="file-explorer">
      <TreeView />
      <FilePreview />
    </div>
  );
};
