import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandOutput,
} from "@aws-sdk/client-s3";
import { S3CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";
import { useCallback, useContext } from "react";

type DeleteObjectCommandParameters = {
  key: DeleteObjectCommandInput["Key"];
  bucket: DeleteObjectCommandInput["Bucket"];
};

const makeDeleteObjectCommand = ({
  bucket,
  key,
}: DeleteObjectCommandParameters) => {
  const input: DeleteObjectCommandInput = {
    Bucket: bucket,
    Key: key,
  };

  return new DeleteObjectCommand(input);
};

export const useDeleteObject = () => {
  const { bucket, client } = useContext(S3CredentialsContext);

  const commandCB = useCallback(
    ({ key }: { key: DeleteObjectCommandParameters["key"] }) => {
      return client
        ? client.send(makeDeleteObjectCommand({ bucket, key }))
        : Promise.resolve<DeleteObjectCommandOutput>({
            $metadata: {},
          });
    },
    [bucket, client]
  );

  return commandCB;
};

export const useDeleteAllObjects = () => {
  const { bucket, client } = useContext(S3CredentialsContext);

  return useCallback(
    ({ keys }: { keys: string[] } = { keys: [] }) => {
      return client
        ? client.send(
            new DeleteObjectsCommand({
              Bucket: bucket,
              Delete: { Objects: keys.map((k) => ({ Key: k })) },
            })
          )
        : Promise.resolve<DeleteObjectsCommandOutput>({
            $metadata: {},
          });
    },
    [bucket, client]
  );
};
