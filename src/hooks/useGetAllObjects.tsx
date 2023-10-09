import { useCallback, useContext } from "react";

import {
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
} from "@aws-sdk/client-s3";

import { CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";

const getAllObjects = (bucket: string) => {
  const input: ListObjectsV2CommandInput = {
    Bucket: bucket,
  };

  return new ListObjectsV2Command(input);
};
export const useGetAllObjects = () => {
  const { bucket, client } = useContext(CredentialsContext);

  const commandCB = useCallback(() => {
    return client ? client.send(getAllObjects(bucket)) : Promise.resolve();
  }, [bucket, client]);

  return commandCB;
};
