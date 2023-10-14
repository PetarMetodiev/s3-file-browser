import { useCallback, useContext } from "react";

import {
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

import { S3CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";

const makeGetAllObjectsCommand = ({
  bucket,
  prefix,
}: {
  bucket: string;
  prefix: string;
}) => {
  const input: ListObjectsV2CommandInput = {
    Bucket: bucket,
    Prefix: prefix,
  };

  return new ListObjectsV2Command(input);
};
export const useGetAllObjects = () => {
  const { bucket, client } = useContext(S3CredentialsContext);

  const commandCB = useCallback(
    ({ prefix }: { prefix: string } = { prefix: "" }) => {
      return client
        ? client.send(makeGetAllObjectsCommand({ bucket, prefix }))
        : Promise.resolve<ListObjectsV2CommandOutput>({
            $metadata: {},
          });
    },
    [bucket, client]
  );

  return commandCB;
};
