import { useContext, useState } from "react";

import type {
  RawObj,
  TreeNode as TreeNodeType,
} from "@src/utils/convertToTreeStructure";

import "./TreeNode.css";
import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/folder-remove.css";
import "css.gg/icons/css/file-document.css";
import "css.gg/icons/css/trash.css";
import "css.gg/icons/css/file-add.css";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { useDeleteObject } from "@src/hooks/useDeleteObject";

type NodeProps = {
  nodeName: TreeNodeType["nodeKey"];
  path: string;
  isDirectory: boolean;
};

export const TreeNode = ({ nodeName, path, isDirectory }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [directoryContents, setDirectoryContents] = useState<RawObj[]>([]);
  const { fetchFileContents, fetchDirectoryContents } =
    useContext(FileContentsContext);
  const deleteObject = useDeleteObject();

  const pathSeparatorIndex = path.indexOf("#");
  const depth = parseInt(path.slice(0, pathSeparatorIndex));
  const pathBelow = `${depth + 1}#${path.slice(pathSeparatorIndex + 1)}`;
  console.log({ depth, path, pathBelow });

  return (
    <li className="tree-node">
      {isDirectory ? (
        <div data-directory>
          <button
            data-expander
            onClick={() =>
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
              })
            }
          >
            {isExpanded ? (
              <i className="gg-folder-remove"></i>
            ) : (
              <i className="gg-folder-add"></i>
            )}{" "}
            {nodeName}/
          </button>
          <button
            data-dir-action
            onClick={() => {
              console.log("adding file...");
            }}
          >
            <i className="gg-file-add"></i>
          </button>
          <button
            data-dir-action
            onClick={() => {
              console.log("adding directory...");
            }}
          >
            <i className="gg-folder-add"></i>
          </button>
          <button
            data-dir-action
            onClick={() => {
              console.log("deleting directory...");
            }}
          >
            <i className="gg-trash"></i>
          </button>
          {isEmpty && <div>Nothing here</div>}
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
          <button data-deleter onClick={() => deleteObject({ key: path })}>
            <i className="gg-trash"></i>
          </button>
        </div>
      )}
      {directoryContents.length > 0 && (
        <ul>
          {directoryContents.map((dc) => {
            const nodeName = dc.key?.split("/").at(-1);
            return (
              <TreeNode
                key={dc.key!}
                nodeName={nodeName!}
                isDirectory={dc.isDir}
                path={dc.key!}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};
