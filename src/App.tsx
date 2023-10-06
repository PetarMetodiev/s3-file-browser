import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

// When no region or credentials are provided, the SDK will use the
// region and credentials from the local AWS config.
const client = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: "AKIAZ5RCAHL6DB3HWD54",
    secretAccessKey: "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",
  },
});

const helloS3 = async () => {
  const input = {
    // ListObjectsV2Request
    Bucket: "interview-task-p-metodiev-a6fea8d1ad38c246", // required
  };
  const command = new ListObjectsV2Command(input);
  client.send(command).then((result) => console.log(result.Contents));
};

function App() {
  const [count, setCount] = useState(0);
  helloS3();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
