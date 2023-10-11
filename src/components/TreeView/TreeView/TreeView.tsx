import { TreeNode } from "../TreeNode/TreeNode";
import { useContext } from "react";

import "./TreeView.css";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";

export const TreeView = () => {
  const { fileTree, isLoading } = useContext(FileContentsContext);

  return (
    <>
      <div>
        {[null, null, null].map((e) => {
          return e;
        })}
        <ul className="tree-view">
          {!isLoading &&
            fileTree.map((n) => {
              return (
                <TreeNode
                  path={n.nodeKey}
                  key={`${n.id}-${n.nodeKey}`}
                  nodeKey={n.nodeKey}
                  childNodes={n.childNodes}
                />
              );
            })}
        </ul>
      </div>
    </>
  );
};
