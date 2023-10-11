import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";
import { useCallback, useContext } from "react";

type GetObjectCommandParameters = {
  key: GetObjectCommandInput["Key"];
  bucket: GetObjectCommandInput["Bucket"];
};

const makeGetObjectCommand = ({ key, bucket }: GetObjectCommandParameters) => {
  const input: GetObjectCommandInput = {
    Bucket: bucket,
    Key: key,
  };

  return new GetObjectCommand(input);
};

export const useGetObject = () => {
  const { bucket, client } = useContext(CredentialsContext);

  const commandCB = useCallback(
    ({ key }: { key: GetObjectCommandParameters["key"] }) => {
      return client
        ? client.send(makeGetObjectCommand({ key, bucket }))
        : Promise.resolve<GetObjectCommandOutput>({
            $metadata: {},
          });
    },
    [bucket, client]
  );

  return commandCB;
};
