import { useCallback, useContext, useEffect, useState } from "react";
import { TreeNode } from "../TreeNode/TreeNode";

import { FileContentsContext } from "@src/contexts/FileContentsContextProvider";
import { Button } from "@src/components/Button/Button";

import { S3CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";
import { directoryLevelSeparator, rootPath } from "@src/utils/consts";

import "./TreeView.css";

export type RawObj = {
  key?: `${number}${typeof directoryLevelSeparator}/${string}`;
  isDir: boolean;
};

type TreeViewProps = {
  className?: string;
};

export const TreeView = ({ className }: TreeViewProps) => {
  const {
    // fetchDirectoryContents,
    showNewFileInput,
    showNewDirectoryInput,
    isLoading,
    // isNewDirectoryInputVisible,
  } = useContext(FileContentsContext);
  const { logout } = useContext(S3CredentialsContext);
  // const [paths, setPaths] = useState<RawObj[] | undefined>();
  // const [emptyBucket, setEmptyBucket] = useState(false);

  // const refreshDirectoryContents = useCallback(
  //   ({ setAsCurrent }: { setAsCurrent: boolean } = { setAsCurrent: false }) => {
  //     fetchDirectoryContents({ path: rootPath, setAsCurrent })
  //       .then((r) => {
  //         setPaths(r);
  //         setEmptyBucket(!r || r.length === 0);
  //       })
  //       .catch();
  //   },
  //   [fetchDirectoryContents]
  // );

  // useEffect(() => {
  //   refreshDirectoryContents({ setAsCurrent: true });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // adding new dirs to the root should refresh the tree
  // useEffect(() => {
  //   if (!isNewDirectoryInputVisible) {
  //     refreshDirectoryContents();
  //   }
  // }, [isNewDirectoryInputVisible, refreshDirectoryContents]);

  return (
    <div className={`tree-view-inner ${className || ""}`}>
      {/* <div data-tree-container> */}
      {/*   {paths && paths.length > 0 && ( */}
      {/*     <> */}
      {/*       <ul data-nodes-container> */}
      {/*         {paths */}
      {/*           .filter((p) => p.isDir) */}
      {/*           .map((p) => { */}
      {/*             const nodeName = p.key?.split("/").at(-1); */}
      {/*             return ( */}
      {/*               <TreeNode */}
      {/*                 key={p.key!} */}
      {/*                 nodeName={nodeName!} */}
      {/*                 isDirectory={p.isDir} */}
      {/*                 path={p.key!} */}
      {/*               /> */}
      {/*             ); */}
      {/*           })} */}
      {/*       </ul> */}
      {/*     </> */}
      {/*   )} */}
      {/* </div> */}
      <ul data-tree-container>
        <TreeNode nodeName="/" isDirectory={true} path={"-1#/"} />
      </ul>
      {/* {!isLoading && emptyBucket && ( */}
      {/*   <div data-no-files> */}
      {/*     Nothing found in the bucket. */}
      {/*     <Button */}
      {/*       onClick={() => */}
      {/*         showNewDirectoryInput({ */}
      {/*           path: rootPath, */}
      {/*           onClose: refreshDirectoryContents, */}
      {/*         }) */}
      {/*       } */}
      {/*       data-add-files */}
      {/*     > */}
      {/*       Add a dir? */}
      {/*     </Button> */}
      {/*     <Button */}
      {/*       onClick={() => */}
      {/*         showNewFileInput({ */}
      {/*           path: rootPath, */}
      {/*           onClose: refreshDirectoryContents, */}
      {/*         }) */}
      {/*       } */}
      {/*       data-add-files */}
      {/*     > */}
      {/*       Or a file? */}
      {/*     </Button> */}
      {/*   </div> */}
      {/* )} */}
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};
