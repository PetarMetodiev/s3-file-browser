import { useContext } from "react";
import "./App.css";

import { CredentialsForm } from "./components/CredentialsForm/CredentialsForm";
import {
  Credentials,
  CredentialsContext,
} from "./contexts/S3CredentialsContextProvider";
import { TreeView } from "./components/TreeView/TreeView/TreeView";

function App() {
  const { updateCredentials, isAuthenticated } = useContext(CredentialsContext);

  const submitCredentials = (credentials: Credentials) => {
    updateCredentials(credentials);
  };

  return (
    <main className="main-wrapper">
      {isAuthenticated ? (
        <TreeView />
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
