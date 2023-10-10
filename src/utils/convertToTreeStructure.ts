const leafNode = null;
type LeafNode = typeof leafNode;
const isLeaf = (el: unknown): el is LeafNode => el === leafNode;

let id = 0;
export type TreeNode = {
  id: number;
  nodeKey: string;
  childNodes: (TreeNode | LeafNode)[];
};

const toTreeNode = (obj: string | LeafNode) => {
  if (isLeaf(obj)) {
    return obj;
  }

  const index = obj.indexOf("/");
  const first = obj.substring(0, index);
  const second = obj.substring(index + 1, obj.length);

  if (!first) {
    return {
      id: id++,
      nodeKey: second,
      childNodes: [leafNode],
    };
  }

  return {
    id: id++,
    nodeKey: first,
    childNodes: [second],
  };
};

const toGrouped = (acc: TreeNode[], curr: TreeNode) => {
  const existsIndex = acc
    .filter(Boolean)
    .findIndex((o) => o.nodeKey === curr.nodeKey);

  if (existsIndex >= 0) {
    const existing = acc[existsIndex];

    const updated = {
      ...existing,
      id: id++,
      childNodes: [existing.childNodes, curr.childNodes].flat(),
    };

    return [
      ...acc.slice(0, existsIndex),
      updated,
      ...acc.slice(existsIndex + 1),
    ];
  }

  return [...acc, curr];
};

export const toTree = (arr: string[]) => {
  return (
    // @ts-expect-error just shut up
    arr
      .map((obj) => toTreeNode(obj!))
      // @ts-expect-error just shut up
      .reduce(toGrouped, [])
      // @ts-expect-error just shut up
      .map((obj: TreeNode | LeafNode) => {
        if (isLeaf(obj)) {
          return obj;
        }

        return {
          id: obj.id,
          nodeKey: obj.nodeKey,
          // @ts-expect-error just shut up
          childNodes: toTree(obj.childNodes),
        };
      })
  );
};
