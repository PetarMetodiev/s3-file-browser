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
  // useEffect,
  useState,
} from "react";

type FileContentsContextType = {
  isLoading: boolean;
  toggleLoading: ({ shouldLoad }: { shouldLoad: boolean }) => void;
  fileContents: string;
  fetchFileContents: ({
    path,
  }: {
    path: string;
  }) => Promise<string | undefined>;
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
  }) => Promise<void>;
  deleteAllObjects: () => void;
  createDirectory: ({
    path,
    directoryName,
  }: {
    path: string;
    directoryName: string;
  }) => Promise<void>;
  deleteDirectory: ({ paths }: { paths: string[] }) => Promise<unknown>;
  fetchDirectoryContents: ({
    path,
  }: {
    path: string;
  }) => Promise<_Object[] | []>;
  isNewDirectoryInputVisible: boolean;
  showNewDirectoryInput: ({
    path,
    onClose,
  }: {
    path: string;
    onClose?: () => void; // possibly return the reason for closing the input
  }) => void;
  isNewFileInputVisible: boolean;
  showNewFileInput: ({
    path,
    onClose,
  }: {
    path: string;
    onClose?: () => void; // possibly return the reason for closing the input
  }) => void;
  selectedPath: string;
  displayPath: string;
};

const defaultContext: FileContentsContextType = {
  isLoading: true,
  toggleLoading: noop,
  fileContents: "",
  fetchFileContents: () => Promise.resolve(""),
  objectKeys: [],
  fetchFileTree: noop,
  isUploading: false,
  uploadFile: () => Promise.resolve(),
  deleteAllObjects: noop,
  createDirectory: () => Promise.resolve(),
  deleteDirectory: () => Promise.resolve(),
  fetchDirectoryContents: () => Promise.resolve([]),
  isNewDirectoryInputVisible: false,
  showNewDirectoryInput: noop,
  isNewFileInputVisible: false,
  showNewFileInput: noop,
  selectedPath: "",
  displayPath: "",
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
  const [selectedPath, setSelectedPath] = useState(defaultContext.selectedPath);
  const [displayPath, setDisplayPath] = useState(defaultContext.displayPath);

  const [onCloseInputCallback, setOnCloseInputCallback] = useState(() => noop);

  const getAllObjects = useGetAllObjects();
  const getObject = useGetObject();
  const putObject = usePutObject();
  const deleteAllObjects = useDeleteAllObjects();

  const toggleLoading = useCallback(
    ({ shouldLoad }: { shouldLoad: boolean }) => {
      setIsLoading(shouldLoad);
    },
    []
  );

  // add support for abort controller
  const fetchFileContents = useCallback(
    ({ path }: { path: string }) => {
      setIsLoading(true);
      return getObject({ key: path })
        .then((r) => r.Body?.transformToString())
        .then((v) => {
          setIsLoading(false);
          setFileContents(v || "no data");

          const pathSeparatorIndex = path.indexOf("#");
          setDisplayPath(`${path.slice(pathSeparatorIndex + 1)}`);
          setIsNewFileInputVisible(false);
          setIsNewDirectoryInputVisible(false);
          return v;
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
    getAllObjects().then((r) => {
      console.log(r);
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
      return putObject({ key: `${path}/${fileName}`, content }).then(() => {
        setIsUploading(false);
        setIsNewFileInputVisible(false);
        setIsNewDirectoryInputVisible(false);
        onCloseInputCallback();
      });
    },
    [putObject, onCloseInputCallback]
  );

  const createDirectory = useCallback(
    ({ path, directoryName }: { path: string; directoryName: string }) => {
      setIsUploading(true);
      const key = `${path}/${directoryName}`;
      return putObject({ key, content: "" }).then(() => {
        setIsUploading(false);
        setIsNewFileInputVisible(false);
        setIsNewDirectoryInputVisible(false);
        onCloseInputCallback();
      });
    },
    [putObject, onCloseInputCallback]
  );

  const deleteDirectory = useCallback(
    ({ paths }: { paths: string[] }) => {
      return deleteAllObjects({ keys: paths }).then((r) => r.Deleted);
    },
    [deleteAllObjects]
  );

  const showNewDirectoryInput = useCallback(
    ({ path, onClose }: { path: string; onClose?: () => void }) => {
      setOnCloseInputCallback(() => onClose);
      setIsNewFileInputVisible(false);
      setSelectedPath(path);
      setIsNewDirectoryInputVisible(true);
      setDisplayPath("");
      setFileContents("");
    },
    []
  );

  const showNewFileInput = useCallback(
    ({ path, onClose }: { path: string; onClose?: () => void }) => {
      setOnCloseInputCallback(() => onClose);
      setIsNewDirectoryInputVisible(false);
      setSelectedPath(path);
      setIsNewFileInputVisible(true);
      setDisplayPath("");
      setFileContents("");
    },
    []
  );

  return (
    <FileContentsContext.Provider
      value={{
        fileContents,
        fetchFileContents,
        isLoading,
        toggleLoading,
        objectKeys,
        fetchFileTree,
        isUploading,
        uploadFile,
        deleteAllObjects: () => {
          getAllObjects()
            .then((r) => r.Contents?.map((o) => o.Key))
            .then((r) => deleteAllObjects({ keys: r as string[] }));
        },
        createDirectory,
        deleteDirectory,
        fetchDirectoryContents,
        isNewDirectoryInputVisible,
        showNewDirectoryInput,
        isNewFileInputVisible,
        showNewFileInput,
        selectedPath,
        displayPath,
      }}
    >
      {children}
    </FileContentsContext.Provider>
  );
};
