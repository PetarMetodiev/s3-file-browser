import { useContext, useState } from "react";

import type { TreeNode as TreeNodeType } from "@src/utils/convertToTreeStructure";

import "./TreeNode.css";
import "css.gg/icons/css/folder-add.css";
import "css.gg/icons/css/folder-remove.css";
import "css.gg/icons/css/file-document.css";
import "css.gg/icons/css/trash.css";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";

type NodeProps = {
  nodeKey: TreeNodeType["nodeKey"];
  path: string;
  childNodes: TreeNodeType["childNodes"];
};

export const TreeNode = ({ nodeKey, childNodes, path }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { fetchFileContents: getFileContents } =
    useContext(FileContentsContext);

  const isLeafNode = childNodes.includes(null);
  const isExpandable = childNodes.findIndex((cn) => cn !== null) > -1;

  return (
    <li className="tree-node">
      {isExpandable && (
        <button data-expander onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? (
            <i className="gg-folder-remove"></i>
          ) : (
            <i className="gg-folder-add"></i>
          )}{" "}
          {nodeKey}/
        </button>
      )}
      {isExpanded && isExpandable && (
        <ul>
          {childNodes.map((c) => {
            if (c !== null) {
              return (
                <TreeNode
                  key={`${c.id}-${c.nodeKey}`}
                  nodeKey={c.nodeKey}
                  childNodes={c.childNodes}
                  path={`${path}/${c.nodeKey}`}
                />
              );
            }
          })}
        </ul>
      )}
      {isLeafNode && (
        <div className="leaf-node">
          <button
            data-data-fetcher
            onClick={() => {
              console.log(path);
              getFileContents({ path });
            }}
          >
            <i className="gg-file-document"></i> {nodeKey}{" "}
          </button>
          <button data-deleter onClick={() => console.log("deleting ", path)}>
            <i className="gg-trash"></i>
          </button>
        </div>
      )}
    </li>
  );
};
