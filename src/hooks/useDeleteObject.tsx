// const deleteObject = (objKey: string) => {
//   const input: DeleteObjectCommandInput = {
//     Bucket,
//     Key: objKey,
//   };
//
//   const command = new DeleteObjectCommand(input);
//   return client.send(command).then(console.log);
// };

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

export const useDeleteObject = ({
  key,
}: {
  key: DeleteObjectCommandParameters["key"];
}) => {
  const { bucket, client } = useContext(CredentialsContext);

  const commandCB = useCallback(() => {
    return client
      ? client.send(makeDeleteObjectCommand({ bucket, key }))
      : Promise.resolve<GetObjectCommandOutput>({
          $metadata: {},
        });
  }, [bucket, client, key]);

  return commandCB;
};
