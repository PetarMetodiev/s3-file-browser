import { useContext } from "react";
import "./App.css";

import { CredentialsForm } from "./components/CredentialsForm/CredentialsForm";
import {
  Credentials,
  CredentialsContext,
} from "./contexts/S3CredentialsContextProvider";
import { FileContentsContextProvider } from "./contexts/FileContentsContextProvider";
import { FileExplorer } from "./components/FileExplorer/FileExplorer";

function App() {
  const { updateCredentials, isAuthenticated } = useContext(CredentialsContext);

  const submitCredentials = (credentials: Credentials) => {
    updateCredentials(credentials);
  };

  return (
    <main className="main-wrapper">
      {isAuthenticated ? (
        <FileContentsContextProvider>
          <FileExplorer />
        </FileContentsContextProvider>
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
