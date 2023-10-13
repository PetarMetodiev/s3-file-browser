import { useCallback, useContext, useState } from "react";

import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { RawObj } from "../TreeView/TreeView";

import "./TreeNode.css";
import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/folder-remove.css";
import "css.gg/icons/css/file-document.css";
import "css.gg/icons/css/trash.css";
import "css.gg/icons/css/file-add.css";

type NodeProps = {
  nodeName: string;
  path: string;
  isDirectory: boolean;
  onDelete: () => void;
};

export const TreeNode = ({
  nodeName,
  path,
  isDirectory,
  onDelete,
}: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [directoryContents, setDirectoryContents] = useState<RawObj[]>([]);
  const {
    fetchFileContents,
    fetchDirectoryContents,
    deleteDirectory,
    deleteFile,
    showNewFileInput,
    showNewDirectoryInput,
  } = useContext(FileContentsContext);

  const pathSeparatorIndex = path.indexOf("#");
  const depth = parseInt(path.slice(0, pathSeparatorIndex));
  const pathBelow = `${depth + 1}#${path.slice(pathSeparatorIndex + 1)}`;

  const refreshDirectoryContents = useCallback(() => {
    fetchDirectoryContents({ path: pathBelow }).then((r) => {
      setIsExpanded(true);
      const ps: RawObj[] | undefined = r
        .map((o) => ({
          key: o.Key,
          isDir: o.Size === 0,
        }))
        .sort((a, b) => Number(b.isDir) - Number(a.isDir));
      setDirectoryContents(ps);
      setIsEmpty(ps.length === 0);
    });
  }, [fetchDirectoryContents, pathBelow]);

  return (
    <li className="tree-node">
      {isDirectory ? (
        <div>
          <div data-directory>
            <button
              data-expander
              onClick={() => {
                if (isExpanded) {
                  setIsExpanded(false);
                  return;
                }
                refreshDirectoryContents();
              }}
            >
              {isExpanded ? (
                <i className="gg-folder-remove"></i>
              ) : (
                <i className="gg-folder-add"></i>
              )}{" "}
              {nodeName}/
            </button>
            {isExpanded && (
              <>
                <button
                  data-dir-action
                  onClick={() => {
                    showNewFileInput({
                      path: pathBelow,
                      onClose: () => refreshDirectoryContents(),
                    });
                  }}
                >
                  <i className="gg-file-add"></i>
                </button>
                <button
                  data-dir-action
                  onClick={() => {
                    showNewDirectoryInput({
                      path: pathBelow,
                      onClose: () => refreshDirectoryContents(),
                    });
                  }}
                >
                  <i className="gg-folder-add"></i>
                </button>

                {isExpanded && !directoryContents.some((obj) => obj.isDir) && (
                  <button
                    data-dir-action
                    onClick={() => {
                      // deleting only if there are no other directories inside
                      // the reason is that if we start drilling recursively, we could end up with a
                      // network congestion of requests just to gather all child keys
                      deleteDirectory({
                        paths: directoryContents
                          .map((dc) => dc.key)
                          .concat(path) as string[],
                      }).then(onDelete);
                    }}
                  >
                    <i className="gg-trash"></i>
                  </button>
                )}
              </>
            )}
          </div>

          {isEmpty && isExpanded && <em data-empty-text>Nothing here</em>}
        </div>
      ) : (
        <div className="leaf-node">
          <button
            data-fetcher
            onClick={() => {
              fetchFileContents({ path });
            }}
          >
            <i className="gg-file-document"></i> {nodeName}{" "}
          </button>
          <button
            data-deleter
            onClick={() => {
              deleteFile({ path }).then(onDelete);
            }}
          >
            <i className="gg-trash"></i>
          </button>
        </div>
      )}
      {isExpanded && directoryContents.length > 0 && (
        <ul>
          {directoryContents.map((dc) => {
            const nodeName = dc.key?.split("/").at(-1);
            return (
              <TreeNode
                key={dc.key!}
                nodeName={nodeName!}
                isDirectory={dc.isDir}
                path={dc.key!}
                onDelete={() => refreshDirectoryContents()}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};
