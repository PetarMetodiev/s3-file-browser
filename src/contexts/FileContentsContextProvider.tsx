import { useGetAllObjects } from "@src/hooks/useGetAllObjects";
import { useGetObject } from "@src/hooks/useGetObject";
import { usePutObject } from "@src/hooks/usePutObject";
import { TreeNode, toTree } from "@src/utils/convertToTreeStructure";
import { noop } from "@src/utils/noop";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

type FileContentsContextType = {
  isLoading: boolean;
  fileContents: string;
  fetchFileContents: ({ path }: { path: string }) => void;
  fileTree: TreeNode[];
  fetchFileTree: () => void;
  isUploading: boolean;
  uploadFile: ({ content, path }: { content: string; path: string }) => void;
};

const defaultContext: FileContentsContextType = {
  isLoading: false,
  fileContents: "Select a file",
  fetchFileContents: noop,
  fileTree: [],
  fetchFileTree: noop,
  isUploading: false,
  uploadFile: noop,
};

export const FileContentsContext =
  createContext<FileContentsContextType>(defaultContext);

export const FileContentsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(defaultContext.isLoading);
  const [fileContents, setFileContents] = useState(defaultContext.fileContents);
  const [fileTree, setFileTree] = useState(defaultContext.fileTree);
  const [isUploading, setIsUploading] = useState(defaultContext.isUploading);

  const getAllObjects = useGetAllObjects();
  const getObject = useGetObject();
  const putObject = usePutObject();

  // add support for abort controller
  const fetchFileContents = useCallback(
    ({ path }: { path: string }) => {
      setIsLoading(true);
      getObject({ key: path })
        .then((r) => r.Body?.transformToString())
        .then((v) => {
          setIsLoading(false);
          setFileContents(v || "no data");
        });
    },
    [getObject]
  );

  const fetchFileTree = useCallback(() => {
    setIsLoading(true);
    getAllObjects()
      .then((r) => {
        console.log(r);
        return (r.Contents || [null]).map((obj) => obj?.Key);
      })
      .then((r) => {
        console.log(r);
        const treeToSet = toTree(r as string[]);
        setIsLoading(false);
        setFileTree(treeToSet);
      });
  }, [getAllObjects]);

  const uploadFile = useCallback(
    ({ path, content }: { path: string; content: string }) => {
      setIsUploading(true);
      putObject({ key: path, content }).then(() => {
        setIsUploading(false);
        fetchFileTree();
      });
    },
    [fetchFileTree, putObject]
  );

  useEffect(() => {
    fetchFileTree();
  }, [fetchFileTree]);

  return (
    <FileContentsContext.Provider
      value={{
        fileContents,
        fetchFileContents,
        isLoading,
        fileTree,
        fetchFileTree,
        isUploading,
        uploadFile,
      }}
    >
      {children}
    </FileContentsContext.Provider>
  );
};
