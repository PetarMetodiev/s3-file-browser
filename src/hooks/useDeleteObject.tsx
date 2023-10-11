import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";
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
  const { bucket, client } = useContext(CredentialsContext);

  const commandCB = useCallback(
    ({ key }: { key: DeleteObjectCommandParameters["key"] }) => {
      return client
        ? client.send(makeDeleteObjectCommand({ bucket, key }))
        : Promise.resolve<GetObjectCommandOutput>({
            $metadata: {},
          });
    },
    [bucket, client]
  );

  return commandCB;
};
