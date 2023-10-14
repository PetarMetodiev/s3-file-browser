import { useCallback, useContext, useState } from "react";

import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { RawObj } from "../TreeView/TreeView";

import "./TreeNode.css";
import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/folder.css";
import "css.gg/icons/css/folder-remove.css";
import "css.gg/icons/css/file-document.css";
import "css.gg/icons/css/trash.css";
import "css.gg/icons/css/file-add.css";
import { directoryLevelSeparator } from "@src/utils/consts";
import { useDoubleClick } from "@src/hooks/useDoubleClick";

export type NodeProps = {
  nodeName: string;
  path: `${number}${typeof directoryLevelSeparator}/${string}`;
  isDirectory: boolean;
  isTile?: boolean;
  onDelete: () => void;
};

export const TreeNode = ({
  nodeName,
  path,
  isDirectory,
  isTile = false,
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
    // currentDirectory,
    // selectCurrentDirectory,
  } = useContext(FileContentsContext);

  const handleClick = useDoubleClick({
    onClick: () => {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        refreshDirectoryContents().then(() => setIsExpanded(true));
      }
    },
    onDoubleClick: () => refreshDirectoryContents({ setAsCurrent: true }),
  });

  const pathSeparatorIndex = path.indexOf(directoryLevelSeparator);
  const depth = parseInt(path.slice(0, pathSeparatorIndex));
  const pathBelow = `${depth + 1}${directoryLevelSeparator}${path.slice(
    pathSeparatorIndex + 1
  )}` as NodeProps["path"];

  const refreshDirectoryContents = useCallback(
    ({ setAsCurrent }: { setAsCurrent: boolean } = { setAsCurrent: false }) => {
      return fetchDirectoryContents({ path: pathBelow, setAsCurrent }).then(
        (r) => {
          // setIsExpanded(true);
          setDirectoryContents(r);
          setIsEmpty(r.length === 0);
        }
      );
    },
    [fetchDirectoryContents, pathBelow]
  );

  return (
    <li className="tree-node" data-tile={isTile}>
      {isDirectory ? (
        <div>
          <div data-directory>
            <button
              data-expander
              onClick={(e) => {
                handleClick(e);
              }}
            >
              {isExpanded ? (
                <i className="gg-folder-remove"></i>
              ) : (
                <i className={`gg-folder${isTile ? "" : "-add"}`}></i>
              )}{" "}
              {nodeName}/
            </button>
            {isExpanded && !isTile && (
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
                          .concat(path) as NodeProps["path"][],
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
      {isExpanded && !isTile && directoryContents.length > 0 && (
        <ul>
          {directoryContents
            .filter((dc) => dc.isDir)
            .map((dc) => {
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
