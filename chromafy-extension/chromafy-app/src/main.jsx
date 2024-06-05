import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "../../extension-files/styles/index.css";
import "../../extension-files/styles/inject.css";

ReactDOM.createRoot(document.getElementById("chromafy-root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
