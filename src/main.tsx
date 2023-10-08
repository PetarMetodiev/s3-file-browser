import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { CredentialsContextProvider } from "./contexts/S3CredentialsContextProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CredentialsContextProvider>
      <App />
    </CredentialsContextProvider>
  </React.StrictMode>
);
