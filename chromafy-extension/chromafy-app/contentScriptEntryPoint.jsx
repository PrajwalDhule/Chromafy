import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import "../extension-files/styles/index.css";

const app = document.createElement("div");
app.id = "main-chromafy-app";
document.body.appendChild(app);

ReactDOM.render(<App />, app);
