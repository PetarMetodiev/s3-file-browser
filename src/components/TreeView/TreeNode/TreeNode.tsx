import { useState } from "react";

import { useGetObject } from "@src/hooks/useGetObject";
import type { TreeNode as TreeNodeType } from "@src/utils/convertToTreeStructure";

import "./TreeNode.css";

type NodeProps = {
  nodeKey: TreeNodeType["nodeKey"];
  path: string;
  childNodes: TreeNodeType["childNodes"];
};

export const TreeNode = ({ nodeKey, childNodes, path }: NodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const getObject = useGetObject({ key: path });

  const isLeafNode = childNodes.includes(null);
  const isExpandable = childNodes.findIndex((cn) => cn !== null) > -1;

  return (
    <li className="tree-node">
      {isExpandable && (
        <button data-expander onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? "👇" : "👉"} {nodeKey}/
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
        <button
          data-data-fetcher
          onClick={() => {
            console.log(path);
            getObject()
              .then((r) => r.Body?.transformToString())
              .then(console.log);
          }}
        >
          Select {nodeKey}
        </button>
      )}
    </li>
  );
};
