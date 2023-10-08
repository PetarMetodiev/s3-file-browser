import { PropsWithChildren, createContext, useState } from "react";
import { noop } from "../utils/noop";

export type Credentials = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

type CredentialsContextType = {
  updateCredentials: (credentials: Credentials) => void;
  isAuthenticated: boolean;
};

export const CredentialsContext = createContext<
  CredentialsContextType & Credentials
>({
  updateCredentials: noop,
  isAuthenticated: false,
  bucket: "",
  region: "",
  accessKeyId: "",
  secretAccessKey: "",
});

export const CredentialsContextProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    console.log("updating credentials: ", {
      accessKeyId,
      bucket,
      region,
      secretAccessKey,
    });
    setIsAuthenticated(true);

    setBucket(bucket);
    setRegion(region);
    setAccessKeyId(accessKeyId);
    setSecretAccessKey(secretAccessKey);
  };

  return (
    <CredentialsContext.Provider
      value={{
        isAuthenticated,
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
