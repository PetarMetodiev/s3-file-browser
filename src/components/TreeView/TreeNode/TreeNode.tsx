import { TreeNode } from "@src/utils/convertToTreeStructure";

type NodeProps = {
  nodeKey: TreeNode["nodeKey"];
  path: string;
  childNodes: TreeNode["childNodes"];
};

export const Node = ({ nodeKey, childNodes, path }: NodeProps) => {
  const isLeafNode = childNodes.includes(null);
  return (
    <div style={{ borderLeft: "2px solid", paddingLeft: "1rem" }}>
      <div>Name: {nodeKey}</div>
      <div>
        {isLeafNode && (
          <button
            onClick={() => console.log(path)}
          >
            Select
          </button>
        )}
      </div>
      <div>
        {childNodes.map((c) => {
          if (c !== null) {
            return (
              <>
                <Node
                  key={`${c.id}-${c.nodeKey}`}
                  nodeKey={c.nodeKey}
                  childNodes={c.childNodes}
                  path={`${path}/${c.nodeKey}`}
                />
              </>
            );
          }
        })}
      </div>
    </div>
  );
};
