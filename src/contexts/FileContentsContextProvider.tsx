import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import { S3ServiceException, _Object } from "@aws-sdk/client-s3";

import {
  useDeleteAllObjects,
  useDeleteObject,
} from "@src/hooks/useDeleteObject";
import { useGetAllObjects } from "@src/hooks/useGetAllObjects";
import { useGetObject } from "@src/hooks/useGetObject";
import { usePutObject } from "@src/hooks/usePutObject";

import { directoryLevelSeparator } from "@src/utils/consts";
import { noop } from "@src/utils/noop";
import { CredentialsContext } from "./S3CredentialsContextProvider";

type FileContentsContextType = {
  isLoading: boolean;
  fileContents: string;
  fetchFileContents: ({
    path,
  }: {
    path: string;
  }) => Promise<string | undefined>;
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
  deleteFile: ({ path }: { path: string }) => Promise<unknown>;
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
    onClose: () => void; // possibly return the reason for closing the input
  }) => void;
  isNewFileInputVisible: boolean;
  showNewFileInput: ({
    path,
    onClose,
  }: {
    path: string;
    onClose: () => void; // possibly return the reason for closing the input
  }) => void;
  selectedPath: string;
  displayPath: string;
  networkError: { name: string; message: string };
};

const defaultContext: FileContentsContextType = {
  isLoading: true,
  fileContents: "",
  fetchFileContents: () => Promise.resolve(""),
  isUploading: false,
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
  selectedPath: "",
  displayPath: "",
  networkError: { name: "", message: "" },
};

export const FileContentsContext =
  createContext<FileContentsContextType>(defaultContext);

export const FileContentsContextProvider = ({
  children,
}: PropsWithChildren) => {
  const { updateCredentials } = useContext(CredentialsContext);

  const [isLoading, setIsLoading] = useState(defaultContext.isLoading);
  const [fileContents, setFileContents] = useState(defaultContext.fileContents);
  const [isUploading, setIsUploading] = useState(defaultContext.isUploading);
  const [isNewFileInputVisible, setIsNewFileInputVisible] = useState(
    defaultContext.isNewFileInputVisible
  );
  const [isNewDirectoryInputVisible, setIsNewDirectoryInputVisible] = useState(
    defaultContext.isNewDirectoryInputVisible
  );
  const [selectedPath, setSelectedPath] = useState(defaultContext.selectedPath);
  const [displayPath, setDisplayPath] = useState(defaultContext.displayPath);
  const [networkError, setNetworkError] = useState(defaultContext.networkError);

  const [onCloseInputCallback, setOnCloseInputCallback] = useState(() => noop);

  const getAllObjects = useGetAllObjects();
  const getObject = useGetObject();
  const putObject = usePutObject();
  const deleteObject = useDeleteObject();
  const deleteAllObjects = useDeleteAllObjects();

  const errorHandler = useCallback(({ name, message }: S3ServiceException) => {
    setNetworkError({ name, message });
    setIsLoading(false);
    setIsUploading(false);
    updateCredentials({
      accessKeyId:"",
      bucket: "",
      region: "",
      secretAccessKey: ""
    })
  }, [updateCredentials]);

  // add support for abort controller
  const fetchFileContents = useCallback(
    ({ path }: { path: string }) => {
      setIsLoading(true);
      return getObject({ key: path })
        .then((r) => r.Body?.transformToString())
        .then((v) => {
          setIsLoading(false);
          setNetworkError(defaultContext.networkError);
          setFileContents(v || "no data");

          const pathSeparatorIndex = path.indexOf(directoryLevelSeparator);
          setDisplayPath(`${path.slice(pathSeparatorIndex + 1)}`);
          setIsNewFileInputVisible(false);
          setIsNewDirectoryInputVisible(false);
          return v;
        }).catch(errorHandler);
    },
    [getObject, errorHandler]
  );

  const fetchDirectoryContents = useCallback(
    ({ path }: { path: string }) => {
      setIsLoading(true);
      return getAllObjects({ prefix: path }).then((r) => {
        setIsLoading(false);
        setNetworkError(defaultContext.networkError);
        return r.Contents || [];
      }).catch(errorHandler);
    },
    [getAllObjects,errorHandler]
  );

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
        setNetworkError(defaultContext.networkError);
        onCloseInputCallback();
      }).catch(errorHandler);
    },
    [putObject, onCloseInputCallback, errorHandler]
  );

  const createDirectory = useCallback(
    ({ path, directoryName }: { path: string; directoryName: string }) => {
      setIsUploading(true);
      const key = `${path}/${directoryName}`;
      return putObject({ key, content: "" }).then(() => {
        setIsUploading(false);
        setIsNewFileInputVisible(false);
        setIsNewDirectoryInputVisible(false);
        setNetworkError(defaultContext.networkError);
        onCloseInputCallback();
      }).catch(errorHandler);
    },
    [putObject, onCloseInputCallback, errorHandler]
  );

  const deleteDirectory = useCallback(
    ({ paths }: { paths: string[] }) => {
      setIsLoading(true);
      return deleteAllObjects({ keys: paths })
        .then((r) => {
          setIsLoading(false);
          setNetworkError(defaultContext.networkError);
          return r.Deleted;
        })
        .catch(errorHandler);
    },
    [deleteAllObjects, errorHandler]
  );

  const deleteFile = useCallback(
    ({ path }: { path: string }) => {
      setIsLoading(true);
      return deleteObject({ key: path }).then((r) => {
        setIsLoading(false);
        setNetworkError(defaultContext.networkError);
        return r.DeleteMarker;
      }, errorHandler);
      // .catch();
    },
    [deleteObject, errorHandler]
  );

  const showNewDirectoryInput = useCallback(
    ({ path, onClose }: { path: string; onClose: () => void }) => {
      setOnCloseInputCallback(() => onClose);
      setIsNewFileInputVisible(false);
      setSelectedPath(path);
      setIsNewDirectoryInputVisible(true);
      setNetworkError(defaultContext.networkError);
      setDisplayPath(defaultContext.displayPath);
      setFileContents(defaultContext.fileContents);
    },
    []
  );

  const showNewFileInput = useCallback(
    ({ path, onClose }: { path: string; onClose: () => void }) => {
      setOnCloseInputCallback(() => onClose);
      setIsNewDirectoryInputVisible(false);
      setSelectedPath(path);
      setIsNewFileInputVisible(true);
      setNetworkError(defaultContext.networkError);
      setDisplayPath(defaultContext.displayPath);
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
        isUploading,
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
        selectedPath,
        displayPath,
        networkError,
      }}
    >
      {children}
    </FileContentsContext.Provider>
  );
};
