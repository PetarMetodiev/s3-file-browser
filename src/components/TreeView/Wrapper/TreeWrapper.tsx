import { useGetAllObjects } from "@src/hooks/useGetAllObjects";
import { Node } from "../TreeNode/TreeNode";
import { TreeNode, toTree } from "@src/utils/convertToTreeStructure";
import { useEffect, useState } from "react";

export const TreeWrapper = () => {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const getAllObjects = useGetAllObjects();

  useEffect(() => {
    getAllObjects()
      .then((r) => {
        return (r.Contents || [null]).map((obj) => obj?.Key);
      })
      .then((r) => {
        console.log(r);
        const treeToSet = toTree(r as string[]);
        console.log(treeToSet);
        setTree(treeToSet);
      });
  }, [getAllObjects]);

  return (
    <div>
      {[null, null, null].map((e) => {
        return e;
      })}
      tree wrapper here
      {tree.map((n) => {
        return (
          <Node
            path={n.nodeKey}
            key={`${n.id}-${n.nodeKey}`}
            nodeKey={n.nodeKey}
            childNodes={n.childNodes}
          />
        );
      })}
    </div>
  );
};
