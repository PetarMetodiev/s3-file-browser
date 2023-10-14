import { useCallback, useContext, useEffect, useState } from "react";
import "./CurrentDirectory.css";
import { rootPath } from "@src/utils/consts";
import { RawObj } from "../TreeView/TreeView/TreeView";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { TreeNode } from "../TreeView/TreeNode/TreeNode";

type CurrentDirectoryProps = {
  className?: string;
};

export const CurrentDirectory = ({ className }: CurrentDirectoryProps) => {
  const [paths, setPaths] = useState<RawObj[] | undefined>();
  const [emptyBucket, setEmptyBucket] = useState(false);

  const { fetchDirectoryContents, isLoading, currentDirectory } =
    useContext(FileContentsContext);

  const refreshDirectoryContents = useCallback(() => {
    fetchDirectoryContents({ path: currentDirectory })
      .then((r) => {
        setPaths(r);
        setEmptyBucket(!r || r.length === 0);
      })
      .catch();
  }, [fetchDirectoryContents, currentDirectory]);

  useEffect(() => refreshDirectoryContents(), [refreshDirectoryContents]);

  return (
    <div className={`current-directory-inner ${className || ""}`}>
      {/* will be used as a scroll container*/}
      <div>
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
