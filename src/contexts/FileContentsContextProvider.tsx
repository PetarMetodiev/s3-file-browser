import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { S3ServiceException } from "@aws-sdk/client-s3";

import {
  useDeleteAllObjects,
  useDeleteObject,
} from "@src/hooks/useDeleteObject";
import { useGetAllObjects } from "@src/hooks/useGetAllObjects";
import { useGetObject } from "@src/hooks/useGetObject";
import { usePutObject } from "@src/hooks/usePutObject";

import { directoryLevelSeparator, rootPath } from "@src/utils/consts";
import { noop } from "@src/utils/noop";
import { S3CredentialsContext } from "./S3CredentialsContextProvider";
import { NodeProps } from "@src/components/TreeView/TreeNode/TreeNode";
import { RawObj } from "@src/components/TreeView/TreeView/TreeView";

type FileContentsContextType = {
  isLoading: boolean;
  fileContents: string;
  fetchFileContents: ({
    path,
  }: {
    path: NodeProps["path"];
  }) => Promise<string | undefined>;
  uploadFile: ({
    content,
    fileName,
    path,
  }: {
    content: string;
    fileName: string;
    path: NodeProps["path"];
  }) => Promise<void>;
  deleteAllObjects: () => void;
  createDirectory: ({
    path,
    directoryName,
  }: {
    path: NodeProps["path"];
    directoryName: string;
  }) => Promise<void>;
  deleteDirectory: ({
    paths,
  }: {
    paths: NodeProps["path"][];
  }) => Promise<unknown>;
  deleteFile: ({ path }: { path: NodeProps["path"] }) => Promise<unknown>;
  fetchDirectoryContents: ({
    path,
    setAsCurrent,
  }: {
    path: NodeProps["path"];
    setAsCurrent?: boolean;
  }) => Promise<RawObj[]>;
  isNewDirectoryInputVisible: boolean;
  showNewDirectoryInput: ({
    path,
    onClose,
  }: {
    path: NodeProps["path"];
    onClose: () => void; // possibly return the reason for closing the input
  }) => void;
  isNewFileInputVisible: boolean;
  showNewFileInput: ({
    path,
    onClose,
  }: {
    path: NodeProps["path"];
    onClose: () => void; // possibly return the reason for closing the input
  }) => void;
  currentDirectory: NodeProps["path"];
  currentFile: string;
  networkError: { name: string; message: string };
};

const defaultContext: FileContentsContextType = {
  isLoading: true,
  fileContents: "",
  fetchFileContents: () => Promise.resolve(""),
  uploadFile: () => Promise.resolve(),
  deleteAllObjects: noop,
  createDirectory: () => Promise.resolve(),
  deleteDirectory: () => Promise.resolve(),
  deleteFile: () => Promise.resolve(),
  fetchDirectoryContents: () => Promise.resolve([]),
  isNewDirectoryInputVisible: false,
  showNewDirectoryInput: noop,
  isNewFileInputVisible: false,
  showNewFileInput: noop,
  currentDirectory: "invalid" as typeof rootPath,
  currentFile: rootPath,
  networkError: { name: "", message: "" },
};

export const FileContentsContext =
  createContext<FileContentsContextType>(defaultContext);

export const FileContentsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const { logout } = useContext(S3CredentialsContext);

  const [isLoading, setIsLoading] = useState(defaultContext.isLoading);

  const [fileContents, setFileContents] = useState(defaultContext.fileContents);
  const [isNewFileInputVisible, setIsNewFileInputVisible] = useState(
    defaultContext.isNewFileInputVisible
  );
  const [isNewDirectoryInputVisible, setIsNewDirectoryInputVisible] = useState(
    defaultContext.isNewDirectoryInputVisible
  );
  const [currentDirectory, setCurrentDirectory] = useState(
    defaultContext.currentDirectory
  );
  const [currentFile, setCurrentFile] = useState(defaultContext.currentFile);
  const [directoryContentsCache, setDirectoryContentsCache] = useState<
    RawObj[]
  >([]);

  const [networkError, setNetworkError] = useState(defaultContext.networkError);

  const [onCloseInputCallback, setOnCloseInputCallback] = useState(() => noop);

  const getAllObjects = useGetAllObjects();
  const getObject = useGetObject();
  const putObject = usePutObject();
  const deleteObject = useDeleteObject();
  const deleteAllObjects = useDeleteAllObjects();

  const errorHandler = useCallback(
    ({ name, message }: S3ServiceException) => {
      setNetworkError({ name, message });
      setIsLoading(false);
      logout();
      throw { name, message };
    },
    [logout]
  );

  // add support for abort controller
  const fetchFileContents = useCallback(
    ({ path }: { path: NodeProps["path"] }) => {
      setIsLoading(true);
      return getObject({ key: path })
        .then((r) => r.Body?.transformToString())
        .then((v) => {
          setIsLoading(false);
          setNetworkError(defaultContext.networkError);
          setFileContents(v || "no data");

          const pathSeparatorIndex = path.indexOf(directoryLevelSeparator);
          setCurrentFile(`${path.slice(pathSeparatorIndex + 1)}`);
          setIsNewFileInputVisible(false);
          setIsNewDirectoryInputVisible(false);
          return v;
        })
        .catch(errorHandler);
    },
    [getObject, errorHandler]
  );

  const fetchDirectoryContents = useCallback(
    ({
      path,
      setAsCurrent,
    }: {
      path: NodeProps["path"];
      setAsCurrent?: boolean;
    }) => {
      setIsLoading(true);
      if (currentDirectory === path) {
        return Promise.resolve(directoryContentsCache);
      }
      return getAllObjects({ prefix: path })
        .then((r) => {
          setIsLoading(false);
          setNetworkError(defaultContext.networkError);

          return (r.Contents || [])
            .map(
              (o) =>
                ({
                  key: o.Key,
                  isDir: o.Size === 0,
                } as RawObj)
            )
            .sort((a, b) => Number(b.isDir) - Number(a.isDir));
        })
        .then((contents) => {
          if (setAsCurrent) {
            setDirectoryContentsCache(contents);
            setCurrentDirectory(path);
          }
          return contents;
        })
        .catch(errorHandler);
    },
    [getAllObjects, errorHandler, currentDirectory, directoryContentsCache]
  );

  const uploadFile = useCallback(
    ({
      path,
      fileName,
      content,
    }: {
      path: NodeProps["path"];
      fileName: string;
      content: string;
    }) => {
      return putObject({ key: `${path}/${fileName}`, content })
        .then(() => {
          setIsNewFileInputVisible(false);
          setIsNewDirectoryInputVisible(false);
          setNetworkError(defaultContext.networkError);
          setDirectoryContentsCache([]);
          onCloseInputCallback();
        })
        .catch(errorHandler);
    },
    [putObject, onCloseInputCallback, errorHandler]
  );

  const createDirectory = useCallback(
    ({
      path,
      directoryName,
    }: {
      path: NodeProps["path"];
      directoryName: string;
    }) => {
      const key = `${path}/${directoryName}`;
      return putObject({ key, content: "" })
        .then(() => {
          setIsNewFileInputVisible(false);
          setIsNewDirectoryInputVisible(false);
          setNetworkError(defaultContext.networkError);
          setDirectoryContentsCache([]);
          onCloseInputCallback();
        })
        .catch(errorHandler);
    },
    [putObject, onCloseInputCallback, errorHandler]
  );

  const deleteDirectory = useCallback(
    ({ paths }: { paths: NodeProps["path"][] }) => {
      setIsLoading(true);
      return deleteAllObjects({ keys: paths })
        .then((r) => {
          setIsLoading(false);
          setNetworkError(defaultContext.networkError);
          setDirectoryContentsCache([]);
          return r.Deleted;
        })
        .catch(errorHandler);
    },
    [deleteAllObjects, errorHandler]
  );

  const deleteFile = useCallback(
    ({ path }: { path: NodeProps["path"] }) => {
      setIsLoading(true);
      return deleteObject({ key: path })
        .then((r) => {
          setIsLoading(false);
          setNetworkError(defaultContext.networkError);
          setDirectoryContentsCache([]);
          return r.DeleteMarker;
        })
        .catch(errorHandler);
    },
    [deleteObject, errorHandler]
  );

  const showNewDirectoryInput = useCallback(
    ({ path, onClose }: { path: NodeProps["path"]; onClose: () => void }) => {
      setOnCloseInputCallback(() => onClose);
      setIsNewFileInputVisible(false);
      setCurrentDirectory(path);
      setIsNewDirectoryInputVisible(true);
      setNetworkError(defaultContext.networkError);
      setCurrentFile(defaultContext.currentFile);
      setFileContents(defaultContext.fileContents);
    },
    []
  );

  const showNewFileInput = useCallback(
    ({ path, onClose }: { path: NodeProps["path"]; onClose: () => void }) => {
      setOnCloseInputCallback(() => onClose);
      setIsNewDirectoryInputVisible(false);
      setCurrentDirectory(path);
      setIsNewFileInputVisible(true);
      setNetworkError(defaultContext.networkError);
      setCurrentFile(defaultContext.currentFile);
      setFileContents(defaultContext.fileContents);
    },
    []
  );

  return (
    <FileContentsContext.Provider
      value={{
        fileContents,
        fetchFileContents,
        isLoading,
        uploadFile,
        deleteAllObjects: () => {
          getAllObjects()
            .then((r) => r.Contents?.map((o) => o.Key))
            .then((r) => deleteAllObjects({ keys: r as string[] }));
        },
        createDirectory,
        deleteDirectory,
        deleteFile,
        fetchDirectoryContents,
        isNewDirectoryInputVisible,
        showNewDirectoryInput,
        isNewFileInputVisible,
        showNewFileInput,
        // current directory path
        currentDirectory,
        // current file path
        currentFile,
        networkError,
        // currentDirectory,
        // selectCurrentDirectory,
      }}
    >
      {children}
    </FileContentsContext.Provider>
  );
};
