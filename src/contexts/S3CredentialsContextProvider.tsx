import { PropsWithChildren, createContext, useState } from "react";
import { S3Client } from "@aws-sdk/client-s3";
import { noop } from "@utils/noop";

export type Credentials = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

type CredentialsContextType = {
  updateCredentials: (credentials: Credentials) => void;
  isAuthenticated: boolean;
  client: S3Client;
};

export const CredentialsContext = createContext<
  CredentialsContextType & Credentials
>({
  updateCredentials: noop,
  isAuthenticated: false,
  client: new S3Client({}),
  bucket: "",
  region: "",
  accessKeyId: "",
  secretAccessKey: "",
});

export const CredentialsContextProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [s3Client, setS3Client] = useState(new S3Client({}));

  const [bucket, setBucket] = useState("");
  const [region, setRegion] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");

  const updateCredentials = ({
    accessKeyId,
    bucket,
    region,
    secretAccessKey,
  }: Credentials) => {
    if (accessKeyId && bucket && region && secretAccessKey) {
      setBucket(bucket);
      setRegion(region);
      setAccessKeyId(accessKeyId);
      setSecretAccessKey(secretAccessKey);

      setS3Client(
        new S3Client({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        })
      );

      setIsAuthenticated(true);
    }
  };

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
