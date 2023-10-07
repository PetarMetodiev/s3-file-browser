import { useState } from "react";
import "./App.css";

import {
  GetObjectCommand,
  GetObjectCommandInput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  _Object,
} from "@aws-sdk/client-s3";
import { CredentialsForm } from "./components/CredentialsForm";

const Bucket = localStorage.getItem("bucket") || "";

const client = new S3Client({
  region: localStorage.getItem("region") || "",
  credentials: {
    accessKeyId: localStorage.getItem("accessKeyId") || "",
    secretAccessKey: localStorage.getItem("secretAccessKey") || "",
  },
});

type ObjectData = {
  key: string;
  content: string;
};

const getAllObjects = () => {
  const input: ListObjectsV2CommandInput = {
    Bucket,
  };
  const command = new ListObjectsV2Command(input);
  return client.send(command);
};

const uploadObject = ({ content, key }: ObjectData) => {
  // for file upload
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/
  const input: PutObjectCommandInput = {
    Bucket,
    Key: key,
    Body: content,
  };

  const command = new PutObjectCommand(input);
  return client.send(command);
};

const getObject = (key: string) => {
  const input: GetObjectCommandInput = {
    Bucket,
    Key: key,
  };

  const command = new GetObjectCommand(input);
  return client.send(command).then((r) => r.Body.transformToString());
};

function App() {
  const [s3data, setS3Data] = useState<_Object[]>();
  const [objData, setObjData] = useState();
  const [objKey, setObjKey] = useState("");
  const [objContent, setObjContent] = useState("");
  const [region, setRegion] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [bucket, setBucket] = useState("");

  const handleUpload = () => {
    setObjKey("");
    setObjContent("");
    return uploadObject({ content: objContent, key: objKey })
      .then((res) => console.log("success:", res))
      .catch((e) => console.log(e));
  };

  const handleGetObject = () => {
    getObject(objKey)
      .then((r) => {
        setObjData(r);
      })
      .catch((e) => console.log(e));
  };

  const handleGetAllObjects = () => {
    getAllObjects()
      .then((r) => r.Contents || [])
      .then((r) =>
        r.sort((obj1, obj2) => {
          return obj2.LastModified?.getTime() - obj1.LastModified?.getTime();
        })
      )
      .then((r) => {
        setS3Data(r);
      })
      .catch((e) => console.log(e));
  };

  const submitCredentials = () => {
    localStorage.setItem("bucket", bucket);
    localStorage.setItem("region", region);
    localStorage.setItem("accessKeyId", accessKeyId);
    localStorage.setItem("secretAccessKey", secretAccessKey);
  };

  return (
    <>
      <CredentialsForm />
      <div>
        <h1>Enter credentials:</h1>
        <label>
          Bucket:
          <input type="text" onChange={(e) => setBucket(e.target.value)} />
        </label>
        <label>
          Region:
          <input type="text" onChange={(e) => setRegion(e.target.value)} />
        </label>
        <label>
          Access Key Id:
          <input type="text" onChange={(e) => setAccessKeyId(e.target.value)} />
        </label>
        <label>
          Secret Access Key:
          <input
            type="text"
            onChange={(e) => setSecretAccessKey(e.target.value)}
          />
        </label>
        <button onClick={submitCredentials}>Submit</button>
      </div>
      <div>
        <h2>Upload object</h2>
        <label>
          File name:
          <input type="text" onChange={(e) => setObjKey(e.target.value)} />
        </label>
        <label>
          File contents name:
          <textarea onChange={(e) => setObjContent(e.target.value)} />
        </label>
        <hr />
        {objKey} / {objContent}
        <button
          onClick={() => {
            handleUpload().then(handleGetAllObjects);
          }}
        >
          Upload
        </button>
      </div>
      <div>
        <h2>Get Single object</h2>
        <button onClick={handleGetObject}>Get single object data</button>
        <pre>{objData}</pre>
      </div>
      <div>
        <h2>Get all objects</h2>
        <button onClick={handleGetAllObjects}>Get all objects data</button>
        {s3data?.map((data) => {
          return (
            <div key={`${data.ETag}-${data.Key}-${data.LastModified}`}>
              <h3>File name: {data.Key}</h3>
              <span className="block">
                Last modified: {data.LastModified?.toLocaleString().toString()}
              </span>
              <span className="block">Size: {data.Size} bytes</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
