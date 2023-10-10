// const getObject = (key: string) => {
//   const input: GetObjectCommandInput = {
//     Bucket,
//     Key: key,
//   };
//
//   const command = new GetObjectCommand(input);
//   return client.send(command).then((r) => r.Body.transformToString());
// };

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

export const useGetObject = ({
  key,
}: {
  key: GetObjectCommandParameters["key"];
}) => {
  const { bucket, client } = useContext(CredentialsContext);

  const commandCB = useCallback(() => {
    return client
      ? client.send(makeGetObjectCommand({ key, bucket }))
      : Promise.resolve<GetObjectCommandOutput>({
          $metadata: {},
        });
  }, [bucket, client, key]);

  return commandCB;
};
