import { useCallback, useContext, useEffect, useState } from "react";
import "./CurrentDirectory.css";
import { RawObj } from "../TreeView/TreeView/TreeView";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { NodeProps, TreeNode } from "../TreeView/TreeNode/TreeNode";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";

type CurrentDirectoryProps = {
  className?: string;
};

export const CurrentDirectory = ({ className }: CurrentDirectoryProps) => {
  const [paths, setPaths] = useState<RawObj[] | undefined>();

  const { fetchDirectoryContents, currentDirectory } =
    useContext(FileContentsContext);

  const refreshDirectoryContents = useCallback(
    ({
      path,
      setAsCurrent,
    }: { path?: NodeProps["path"]; setAsCurrent?: boolean } = {}) => {
      fetchDirectoryContents({ path: path || currentDirectory, setAsCurrent })
        .then((r) => {
          setPaths(r);
        })
        .catch();
    },
    [fetchDirectoryContents, currentDirectory]
  );

  useEffect(() => refreshDirectoryContents(), [refreshDirectoryContents]);

  const depth = parseInt(currentDirectory.split("/")[0]);
  const segments = currentDirectory.split("/").slice(1).filter(Boolean);

  return (
    <div className={`current-directory-inner ${className || ""}`}>
      {/* will be used as a scroll container*/}
      <div>
        <div data-breadcrumbs>
          <Breadcrumbs
            depth={depth}
            segments={segments}
            onClick={(e) =>
              refreshDirectoryContents({ path: e, setAsCurrent: true })
            }
          />
        </div>
        {paths && paths.length > 0 && (
          <ul data-nodes-container>
            {paths.map((p) => {
              const nodeName = p.key?.split("/").at(-1);
              return (
                <TreeNode
                  key={p.key!}
                  nodeName={nodeName!}
                  isDirectory={p.isDir}
                  path={p.key!}
                  isTile={true}
                  onDelete={refreshDirectoryContents}
                />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
