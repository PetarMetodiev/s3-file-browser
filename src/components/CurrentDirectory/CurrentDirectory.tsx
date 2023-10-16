import { useCallback, useContext, useEffect, useState } from "react";
import "./CurrentDirectory.css";
import { RawObj } from "../TreeView/TreeView/TreeView";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { NodeProps, TreeNode } from "../TreeView/TreeNode/TreeNode";
import { Breadcrumbs } from "../Breadcrumbs/Breadcrumbs";
import { DirectoryActions } from "../DirectoryActions/DirectoryActions";

type CurrentDirectoryProps = {
  className?: string;
};

export const CurrentDirectory = ({ className }: CurrentDirectoryProps) => {
  const [paths, setPaths] = useState<RawObj[] | undefined>();

  const {
    fetchDirectoryContents,
    deleteFile,
    currentDirectory,
    showNewFileInput,
    showNewDirectoryInput,
  } = useContext(FileContentsContext);

  const refreshDirectoryContents = useCallback(
    ({
      path,
      setAsCurrent,
      bustCache,
    }: {
      path?: NodeProps["path"];
      setAsCurrent?: boolean;
      bustCache?: boolean;
    } = {}) => {
      fetchDirectoryContents({
        path: path || currentDirectory,
        setAsCurrent,
        bustCache,
      })
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
      <div data-breadcrumbs>
        <Breadcrumbs
          depth={depth}
          segments={segments}
          onClick={(e) =>
            refreshDirectoryContents({ path: e, setAsCurrent: true })
          }
        />
      </div>
      <div data-nodes-wrapper>
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
                  onFileDelete={(ev) => {
                    deleteFile({ path: ev.path }).then(() =>
                      refreshDirectoryContents({
                        setAsCurrent: true,
                        bustCache: true,
                      })
                    );
                  }}
                />
              );
            })}
          </ul>
        )}
      </div>
      <div data-dir-actions-container>
        <DirectoryActions
          onNewFile={() =>
            showNewFileInput({
              path: currentDirectory,
              onClose: () =>
                refreshDirectoryContents({
                  path: currentDirectory,
                  setAsCurrent: true,
                  bustCache: true,
                }),
            })
          }
          onNewDirectory={() =>
            showNewDirectoryInput({
              path: currentDirectory,
              onClose: () =>
                refreshDirectoryContents({
                  path: currentDirectory,
                  setAsCurrent: true,
                  bustCache: true,
                }),
            })
          }
          onDelete={() => console.log("on delete")}
          showDelete={true}
        />
      </div>
    </div>
  );
};
