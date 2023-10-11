import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { noop } from "@utils/noop";
import {
  accessKeyIdLS,
  bucketLS,
  regionLS,
  secretAccessKeyLS,
} from "@src/utils/consts";

const defaultContext = {
  updateCredentials: noop,
  isAuthenticated: false,
  client: null,
  bucket: localStorage.getItem(bucketLS) || "",
  region: localStorage.getItem(regionLS) || "",
  accessKeyId: localStorage.getItem(accessKeyIdLS) || "",
  secretAccessKey: localStorage.getItem(secretAccessKeyLS) || "",
};

type CredentialsContextType = {
  updateCredentials: (credentials: Credentials) => void;
  isAuthenticated: boolean;
  client: S3Client | null;
};

export type Credentials = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export const CredentialsContext = createContext<
  CredentialsContextType & Credentials
>(defaultContext);

export const CredentialsContextProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [s3Client, setS3Client] = useState<S3Client | null>(defaultContext.client);

  const [bucket, setBucket] = useState(defaultContext.bucket);
  const [region, setRegion] = useState(defaultContext.region);
  const [accessKeyId, setAccessKeyId] = useState(defaultContext.accessKeyId);
  const [secretAccessKey, setSecretAccessKey] = useState(
    defaultContext.secretAccessKey
  );
  const setAuthentication = useCallback(() => {
    if (region && accessKeyId && secretAccessKey) {
      setS3Client(
        new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })
      );
    }
    setIsAuthenticated(
      !!bucket && !!region && !!accessKeyId && !!secretAccessKey
    );
  }, [
    bucket,
    region,
    accessKeyId,
    secretAccessKey,
    // setS3Client,
    setIsAuthenticated,
  ]);

  const updateCredentials = useCallback(
    ({ accessKeyId, bucket, region, secretAccessKey }: Credentials) => {
      setBucket(bucket);
      localStorage.setItem(bucketLS, bucket);
      setRegion(region);
      localStorage.setItem(regionLS, region);
      setAccessKeyId(accessKeyId);
      localStorage.setItem(accessKeyIdLS, accessKeyId);
      setSecretAccessKey(secretAccessKey);
      localStorage.setItem(secretAccessKeyLS, secretAccessKey);

      setAuthentication();
    },
    [setAuthentication]
  );
  useEffect(() => setAuthentication(), [setAuthentication]);

  return (
    <CredentialsContext.Provider
      value={{
        isAuthenticated,
        client: s3Client,
        bucket,
        region,
        accessKeyId,
        secretAccessKey,
        updateCredentials,
      }}
    >
      {children}
    </CredentialsContext.Provider>
  );
};
