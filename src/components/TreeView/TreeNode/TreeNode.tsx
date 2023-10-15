import { useCallback, useContext, useEffect, useState } from "react";

import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { directoryLevelSeparator } from "@src/utils/consts";
import { useDoubleClick } from "@src/hooks/useDoubleClick";
import { RawObj } from "../TreeView/TreeView";

import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/folder.css";
import "css.gg/icons/css/folder-remove.css";
import "css.gg/icons/css/file-document.css";
import "css.gg/icons/css/trash.css";
import "css.gg/icons/css/file-add.css";
import "./TreeNode.css";

export type NodeProps = {
  nodeName: string;
  path: `${number}${typeof directoryLevelSeparator}/${string}`;
  isDirectory: boolean;
  isTile?: boolean;
  onDelete: () => void;
};

const flattenPath = (path: NodeProps["path"]) => {
  const depthIndicatorIndex = path.indexOf(directoryLevelSeparator);
  return path
    .slice(depthIndicatorIndex + 1)
    .split("/")
    .filter(Boolean);
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
    deleteFile,
    currentDirectory,
  } = useContext(FileContentsContext);

  const handleClick = useDoubleClick({
    onClick: () => {
      if (isExpanded) {
        setIsExpanded(false);
      } else if (!isTile) {
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
          setDirectoryContents(r);
          setIsEmpty(r.length === 0);
        }
      );
    },
    [fetchDirectoryContents, pathBelow]
  );

  useEffect(() => {
    const flatPathBelow = flattenPath(pathBelow);
    const flatCurrentDirectory = flattenPath(currentDirectory).slice(
      0,
      flatPathBelow.length
    );

    if (
      JSON.stringify(flatPathBelow) === JSON.stringify(flatCurrentDirectory) ||
      currentDirectory === pathBelow
    ) {
      refreshDirectoryContents().then(() => setIsExpanded(true));
    }
  }, [currentDirectory, pathBelow, refreshDirectoryContents]);

  return (
    <li className="tree-node" data-tile={isTile}>
      {isDirectory ? (
        <div>
          <div data-directory>
            <button
              data-expander
              data-selected={currentDirectory === pathBelow}
              onClick={handleClick}
            >
              {isExpanded && !isTile ? (
                <i className="gg-folder-remove"></i>
              ) : (
                <i className={`gg-folder${isTile ? "" : "-add"}`}></i>
              )}{" "}
              {nodeName}
            </button>
          </div>

          {isEmpty && isExpanded && <em data-empty-text>Nothing here</em>}
        </div>
      ) : (
        <div className="leaf-node">
          <button
            data-fetcher
            onDoubleClick={() => {
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
