import { useContext } from "react";
import "./App.css";

import { CredentialsForm } from "./components/CredentialsForm/CredentialsForm";
import {
  Credentials,
  CredentialsContext,
} from "./contexts/S3CredentialsContextProvider";
import { TreeWrapper } from "./components/TreeView/Wrapper/TreeWrapper";

function App() {
  const { updateCredentials, isAuthenticated } = useContext(CredentialsContext);

  const submitCredentials = (credentials: Credentials) => {
    updateCredentials(credentials);
  };

  return (
    <main className="main-wrapper">
      {isAuthenticated ? (
        <TreeWrapper />
      ) : (
        <CredentialsForm
          className="form-wrapper"
          onSubmit={(e) => submitCredentials(e)}
        />
      )}
    </main>
  );
}

export default App;

// const Bucket = localStorage.getItem("bucket") || "";

// type ObjectData = {
//   key: string;
//   content: string;
// };

// const getAllObjects = () => {
//   const input: ListObjectsV2CommandInput = {
//     Bucket,
//   };
//   const command = new ListObjectsV2Command(input);
//   return client.send(command);
// };

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

// const getObject = (key: string) => {
//   const input: GetObjectCommandInput = {
//     Bucket,
//     Key: key,
//   };
//
//   const command = new GetObjectCommand(input);
//   return client.send(command).then((r) => r.Body.transformToString());
// };

// const deleteObject = (objKey: string) => {
//   const input: DeleteObjectCommandInput = {
//     Bucket,
//     Key: objKey,
//   };
//
//   const command = new DeleteObjectCommand(input);
//   return client.send(command).then(console.log);
// };
