const leafNode = null;
type LeafNode = typeof leafNode;
const isLeaf = (el: unknown): el is LeafNode => el === leafNode;

type TreeNode = {
  key: string;
  children: (TreeNode | LeafNode)[];
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
      key: second,
      children: [leafNode],
    };
  }

  return {
    key: first,
    children: [second],
  };
};

const toGrouped = (acc: TreeNode[], curr: TreeNode) => {
  const existsIndex = acc.filter(Boolean).findIndex((o) => o.key === curr.key);

  if (existsIndex >= 0) {
    const existing = acc[existsIndex];

    const updated = {
      ...existing,
      children: [existing.children, curr.children].flat(),
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
          key: obj.key,
          // @ts-expect-error just shut up
          children: toTree(obj.children),
        };
      })
  );
};
