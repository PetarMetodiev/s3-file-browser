import { FormEvent, useState } from "react";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

import { S3Credentials } from "@contexts/S3CredentialsContextProvider";

import "./CredentialsForm.css";

type CredentialsFormProps = {
  onSubmit: (e: S3Credentials) => void;
  className?: string;
};

export const CredentialsForm = ({
  onSubmit,
  className,
}: CredentialsFormProps) => {
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
  };

  return (
    <form className={`credentials-form ${className}`} onSubmit={handleSubmit}>
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
      <Button className="credentials-form__button">Open file browser</Button>
    </form>
  );
};
