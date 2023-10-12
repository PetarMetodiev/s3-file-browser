import { TreeNode } from "../TreeNode/TreeNode";
import { useContext, useEffect, useState } from "react";

import "./TreeView.css";
import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { RawObj } from "@src/utils/convertToTreeStructure";
import { Button } from "@src/components/form-controls/Button/Button";

export const TreeView = () => {
  const {
    isLoading,
    fetchDirectoryContents,
    showNewFileInput,
    showNewDirectoryInput,
  } = useContext(FileContentsContext);
  const [paths, setPaths] = useState<RawObj[] | undefined>();
  // const paths: RawObj[] | undefined = objectKeys
  //   ?.map((o) => ({
  //     key: o.Key,
  //     isDir: o.Size === 0,
  //   }))
  //   .sort((a, b) => Number(b.isDir) - Number(a.isDir));
  //
  // console.log({ paths });
  // const paths = objectKeys?.map((o) => o.Key) || ["asd", "ddd", "ddd/fff"];

  useEffect(() => {
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

  return (
    <div className="tree-view">
      {paths ? (
        <ul data-tree-container>
          {paths.map((p) => {
            const nodeName = p.key?.split("/").at(-1);
            return (
              <TreeNode
                key={p.key!}
                nodeName={nodeName!}
                isDirectory={p.isDir}
                path={p.key!}
              />
            );
          })}
          {/* {toTree(paths as string[]).map((n: TreeNodeType) => { */}
          {/*   return ( */}
          {/*     <TreeNode */}
          {/*       path={n.nodeKey} */}
          {/*       key={`${n.id}-${n.nodeKey}`} */}
          {/*       nodeKey={n.nodeKey} */}
          {/*       childNodes={n.childNodes} */}
          {/*     /> */}
          {/*   ); */}
          {/* })} */}
        </ul>
      ) : (
        <div data-no-files>
          Nothing found in the bucket.
          <Button onClick={() => showNewDirectoryInput()} data-add-files>
            Add a dir?
          </Button>
          <Button onClick={() => showNewFileInput()} data-add-files>
            Or a file?
          </Button>
        </div>
      )}
    </div>
  );
};
