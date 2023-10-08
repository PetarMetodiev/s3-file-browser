import { FormEvent, useState } from "react";
import { Input } from "./form-controls/input/Input";
import { Button } from "./form-controls/button/Button";

import "./CredentialsForm.css";

type Credentials = {
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

type CredentialsFormProps = {
  onSubmit: (e: Credentials) => void;
};

export const CredentialsForm = ({ onSubmit }: CredentialsFormProps) => {
  const [bucket, setBucket] = useState("");
  const [region, setRegion] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      bucket,
      region,
      accessKeyId,
      secretAccessKey,
    });
    console.log(e.target);
  };

  return (
    <>
      <form className="credentials-form" onSubmit={handleSubmit}>
        <Input label="Bucket" value={bucket} onChange={setBucket} required />
        <Input label="Region" value={region} onChange={setRegion} required />
        <Input
          label="Access key ID"
          value={accessKeyId}
          onChange={setAccessKeyId}
          required
        />
        <Input
          label="Secret access key"
          value={secretAccessKey}
          onChange={setSecretAccessKey}
          required
        />
        <Button className="credentials-form__button">Submit</Button>
      </form>
    </>
  );
};
