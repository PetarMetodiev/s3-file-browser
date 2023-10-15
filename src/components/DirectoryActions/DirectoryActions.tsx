import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/trash.css";
import "css.gg/icons/css/file-add.css";

import "./DirectoryActions.css";

type DirectoryActionsProps = {
  onNewFile: () => void;
  onNewDirectory: () => void;
  onDelete: () => void;
  showDelete: boolean;
};

export const DirectoryActions = ({
  onNewFile,
  onNewDirectory,
  onDelete,
  showDelete,
}: DirectoryActionsProps) => {
  return (
    <div className="directory-actions-inner">
      <button
        data-dir-action
        onClick={onNewFile}
        // onClick={() => {
        //   showNewFileInput({
        //     path: pathBelow,
        //     // onClose: () => refreshDirectoryContents(),
        //   });
        // }}
      >
        <i className="gg-file-add"></i>
        <span data-text-container>Create file</span>
      </button>
      <button
        data-dir-action
        onClick={onNewDirectory}
        // onClick={() => {
        //   showNewDirectoryInput({
        //     path: pathBelow,
        //     // onClose: () => refreshDirectoryContents(),
        //   });
        // }}
      >
        <i className="gg-folder-add"></i>
        <span data-text-container>Create directory</span>
      </button>

      {/* {!directoryContents.some((obj) => obj.isDir) && ( */}
      {showDelete && (
        <button
          data-dir-action
          onClick={onDelete}
          // onClick={() => {
          //   // deleting only if there are no other directories inside
          //   // the reason is that if we start drilling recursively, we could end up with a
          //   // network congestion of requests just to gather all child keys
          //   deleteDirectory({
          //     paths: directoryContents
          //       .map((dc) => dc.key)
          //       .concat(path) as NodeProps["path"][],
          //   }).then(onDelete);
          // }}
        >
          <i className="gg-trash"></i>
          <span data-text-container>Delete current directory</span>
        </button>
      )}
    </div>
  );
};
