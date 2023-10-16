import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/trash.css";
import "css.gg/icons/css/file-add.css";

import "./DirectoryActions.css";

type DirectoryActionsProps = {
  onNewFile: () => void;
  onNewDirectory: () => void;
};

export const DirectoryActions = ({
  onNewFile,
  onNewDirectory,
}: DirectoryActionsProps) => {
  return (
    <div className="directory-actions-inner">
      <button data-dir-action onClick={onNewFile}>
        <i className="gg-file-add"></i>
        <span data-text-container>Create file</span>
      </button>
      <button data-dir-action onClick={onNewDirectory}>
        <i className="gg-folder-add"></i>
        <span data-text-container>Create directory</span>
      </button>
    </div>
  );
};
