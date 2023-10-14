import { useCallback, useContext, useEffect, useState } from "react";
import { TreeNode } from "../TreeNode/TreeNode";

import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { Button } from "@src/components/Button/Button";

import "./TreeView.css";
import "css.gg/icons/css/file-add.css";
import "css.gg/icons/css/folder-add.css";
import { S3CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";
import { directoryLevelSeparator, rootPath } from "@src/utils/consts";

export type RawObj = {
  key?: `${number}${typeof directoryLevelSeparator}/${string}`;
  isDir: boolean;
};

type TreeViewProps = {
  className?: string;
};

export const TreeView = ({ className }: TreeViewProps) => {
  const {
    fetchDirectoryContents,
    showNewFileInput,
    showNewDirectoryInput,
    isLoading,
  } = useContext(FileContentsContext);
  const { logout } = useContext(S3CredentialsContext);
  const [paths, setPaths] = useState<RawObj[] | undefined>();
  const [emptyBucket, setEmptyBucket] = useState(false);

  const refreshDirectoryContents = useCallback(() => {
    fetchDirectoryContents({ path: "0#/" })
      .then((r) => {
        const ps: RawObj[] | undefined = r
          .map((o) => ({
            key: o.Key as RawObj["key"],
            isDir: o.Size === 0,
          }))
          .sort((a, b) => Number(b.isDir) - Number(a.isDir));
        setPaths(ps);
        setEmptyBucket(!ps || ps.length === 0);
      })
      .catch();
  }, [fetchDirectoryContents]);

  useEffect(() => {
    refreshDirectoryContents();
  }, [refreshDirectoryContents]);

  return (
    <div className={`tree-view-inner ${className || ""}`}>
      <div data-tree-container>
        {paths && paths.length > 0 && (
          <>
            <ul data-nodes-container>
              {paths
                .filter((p) => p.isDir)
                .map((p) => {
                  const nodeName = p.key?.split("/").at(-1);
                  return (
                    <TreeNode
                      key={p.key!}
                      nodeName={nodeName!}
                      isDirectory={p.isDir}
                      path={p.key!}
                      onDelete={refreshDirectoryContents}
                    />
                  );
                })}
            </ul>
            <div data-root-actions>
              <button
                onClick={() =>
                  showNewFileInput({
                    path: rootPath,
                    onClose: refreshDirectoryContents,
                  })
                }
              >
                <i className="gg-file-add"></i>
              </button>
              <button
                onClick={() =>
                  showNewDirectoryInput({
                    path: rootPath,
                    onClose: refreshDirectoryContents,
                  })
                }
              >
                <i className="gg-folder-add"></i>
              </button>
            </div>
          </>
        )}
      </div>
      {!isLoading && emptyBucket && (
        <div data-no-files>
          Nothing found in the bucket.
          <Button
            onClick={() =>
              showNewDirectoryInput({
                path: rootPath,
                onClose: refreshDirectoryContents,
              })
            }
            data-add-files
          >
            Add a dir?
          </Button>
          <Button
            onClick={() =>
              showNewFileInput({
                path: rootPath,
                onClose: refreshDirectoryContents,
              })
            }
            data-add-files
          >
            Or a file?
          </Button>
        </div>
      )}
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};
