import { _Object } from "@aws-sdk/client-s3";
import { useDeleteAllObjects } from "@src/hooks/useDeleteObject";
import { useGetAllObjects } from "@src/hooks/useGetAllObjects";
import { useGetObject } from "@src/hooks/useGetObject";
import { usePutObject } from "@src/hooks/usePutObject";
// import { TreeNode, toTree } from "@src/utils/convertToTreeStructure";
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
  objectKeys?: _Object[];
  fetchFileTree: () => void;
  isUploading: boolean;
  uploadFile: ({
    content,
    fileName,
    path,
  }: {
    content: string;
    fileName: string;
    path: string;
  }) => void;
  deleteAllObjects: () => void;
  createDirectory: ({
    path,
    directoryName,
  }: {
    path: string;
    directoryName: string;
  }) => void;
  fetchDirectoryContents: ({ path }: { path: string }) => Promise<_Object[] | []>;
  isNewDirectoryInputVisible: boolean;
  showNewDirectoryInput: () => void;
  isNewFileInputVisible: boolean;
  showNewFileInput: () => void;
};

const defaultContext: FileContentsContextType = {
  isLoading: false,
  fileContents: "",
  fetchFileContents: noop,
  objectKeys: [],
  fetchFileTree: noop,
  isUploading: false,
  uploadFile: noop,
  deleteAllObjects: noop,
  createDirectory: noop,
  fetchDirectoryContents: () => Promise.resolve([]),
  isNewDirectoryInputVisible: false,
  showNewDirectoryInput: noop,
  isNewFileInputVisible: false,
  showNewFileInput: noop,
};

export const FileContentsContext =
  createContext<FileContentsContextType>(defaultContext);

export const FileContentsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(defaultContext.isLoading);
  const [fileContents, setFileContents] = useState(defaultContext.fileContents);
  const [objectKeys, setObjectKeys] = useState(defaultContext.objectKeys);
  const [isUploading, setIsUploading] = useState(defaultContext.isUploading);
  const [isNewFileInputVisible, setIsNewFileInputVisible] = useState(
    defaultContext.isNewFileInputVisible
  );
  const [isNewDirectoryInputVisible, setIsNewDirectoryInputVisible] = useState(
    defaultContext.isNewDirectoryInputVisible
  );

  const getAllObjects = useGetAllObjects();
  const getObject = useGetObject();
  const putObject = usePutObject();
  const deleteAllObjects = useDeleteAllObjects();

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

  const fetchDirectoryContents = useCallback(
    ({ path }: { path: string }) => {
      setIsLoading(true);
      return getAllObjects({ prefix: path }).then((r) => {
        setIsLoading(false);
        return r.Contents || [];
      });
    },
    [getAllObjects]
  );

  const fetchFileTree = useCallback(() => {
    setIsLoading(true);
    getAllObjects()
      // .then((r) => {
      //   console.log(r);
      //   console.log(r.Contents)
      //   return (r.Contents || [{ Key: null }]).map((obj) => obj?.Key);
      // })
      .then((r) => {
        console.log(r);
        // deleteAllObjects({ keys: r });
        // const treeToSet = toTree(r as string[]);
        setIsLoading(false);
        setObjectKeys(r.Contents);
      });
  }, [getAllObjects]);

  const uploadFile = useCallback(
    ({
      path,
      fileName,
      content,
    }: {
      path: string;
      fileName: string;
      content: string;
    }) => {
      setIsUploading(true);
      putObject({ key: `${path}/${fileName}`, content }).then(() => {
        setIsUploading(false);
        setIsNewFileInputVisible(false);
        setIsNewDirectoryInputVisible(false);
        fetchFileTree();
      });
    },
    [fetchFileTree, putObject]
  );

  const createDirectory = useCallback(
    ({ path, directoryName }: { path: string; directoryName: string }) => {
      setIsUploading(true);
      const key = `${path}/${directoryName}`;
      putObject({ key, content: "" }).then(() => {
        setIsUploading(false);
        setIsNewFileInputVisible(false);
        setIsNewDirectoryInputVisible(false);
        fetchFileTree();
      });
    },
    [putObject, fetchFileTree]
  );

  const showNewDirectoryInput = useCallback(() => {
    setIsNewFileInputVisible(false);
    setIsNewDirectoryInputVisible(true);
  }, []);

  const showNewFileInput = useCallback(() => {
    setIsNewDirectoryInputVisible(false);
    setIsNewFileInputVisible(true);
  }, []);

  useEffect(() => {
    console.log("Delete this when done");
    fetchFileTree();
  }, [fetchFileTree]);

  return (
    <FileContentsContext.Provider
      value={{
        fileContents,
        fetchFileContents,
        isLoading,
        objectKeys,
        fetchFileTree,
        isUploading,
        uploadFile,
        deleteAllObjects: () => {
          getAllObjects()
            .then((r) => r.Contents?.map((o) => o.Key))
            .then((r) => deleteAllObjects({ keys: r }));
        },
        createDirectory,
        fetchDirectoryContents,
        isNewDirectoryInputVisible,
        showNewDirectoryInput,
        isNewFileInputVisible,
        showNewFileInput,
      }}
    >
      {children}
    </FileContentsContext.Provider>
  );
};
