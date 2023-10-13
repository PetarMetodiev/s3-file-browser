import { useCallback, useContext, useEffect, useState } from "react";
import { TreeNode } from "../TreeNode/TreeNode";

import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { Button } from "@src/components/Button/Button";

import "./TreeView.css";
import "css.gg/icons/css/file-add.css";
import "css.gg/icons/css/folder-add.css";
import { CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";

export type RawObj = {
  key?: string;
  isDir: boolean;
};

export const TreeView = () => {
  const { fetchDirectoryContents, showNewFileInput, showNewDirectoryInput } =
    useContext(FileContentsContext);
  const { updateCredentials } = useContext(CredentialsContext);
  const [paths, setPaths] = useState<RawObj[] | undefined>();

  const refreshDirectoryContents = useCallback(() => {
    fetchDirectoryContents({ path: "0#/" }).then((r) => {
      const ps: RawObj[] | undefined = r
        .map((o) => ({
          key: o.Key,
          isDir: o.Size === 0,
        }))
        .sort((a, b) => Number(b.isDir) - Number(a.isDir));
      setPaths(ps);
    });
  }, [fetchDirectoryContents]);

  useEffect(() => {
    refreshDirectoryContents();
  }, [refreshDirectoryContents]);

  return (
    <div className="tree-view">
      {paths && paths?.length > 0 ? (
        <div data-tree-container>
          <ul data-nodes-container>
            {paths.map((p) => {
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
                  path: "0#",
                  onClose: refreshDirectoryContents,
                })
              }
            >
              <i className="gg-file-add"></i>
            </button>
            <button
              onClick={() =>
                showNewDirectoryInput({
                  path: "0#",
                  onClose: refreshDirectoryContents,
                })
              }
            >
              <i className="gg-folder-add"></i>
            </button>
          </div>
        </div>
      ) : (
        <div data-no-files>
          Nothing found in the bucket.
          <Button
            onClick={() => showNewDirectoryInput({ path: "0#" })}
            data-add-files
          >
            Add a dir?
          </Button>
          <Button
            onClick={() => showNewFileInput({ path: "0#" })}
            data-add-files
          >
            Or a file?
          </Button>
        </div>
      )}
      <Button
        onClick={() =>
          updateCredentials({
            accessKeyId: "",
            bucket: "",
            region: "",
            secretAccessKey: "",
          })
        }
      >
        Logout
      </Button>
    </div>
  );
};
