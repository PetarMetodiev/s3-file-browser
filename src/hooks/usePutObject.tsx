// const uploadObject = ({ content, key }: ObjectData) => {
//   // for file upload
//   // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/
//   const input: PutObjectCommandInput = {
//     Bucket,
//     Key: key,
//     Body: content,
//   };
//
//   const command = new PutObjectCommand(input);
//   return client.send(command);
// };

import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { CredentialsContext } from "@src/contexts/S3CredentialsContextProvider";
import { useCallback, useContext } from "react";

type PutObjectCommandParameters = {
  content: PutObjectCommandInput["Body"];
  key: PutObjectCommandInput["Key"];
  bucket: PutObjectCommandInput["Bucket"];
};

const makePutObjectCommand = ({
  content,
  key,
  bucket,
}: PutObjectCommandParameters) => {
  const input: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: content,
  };

  return new PutObjectCommand(input);
};

export const usePutObject = ({
  key,
  content,
}: {
  key: PutObjectCommandParameters["key"];
  content: PutObjectCommandParameters["content"];
}) => {
  const { bucket, client } = useContext(CredentialsContext);

  const commandCB = useCallback(() => {
    return client
      ? client.send(makePutObjectCommand({ bucket, key, content }))
      : Promise.resolve<PutObjectCommandOutput>({
          $metadata: {},
        });
  }, [bucket, client, key, content]);

  return commandCB;
};
