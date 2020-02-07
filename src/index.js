import React from "react";
import ReactDOM from "react-dom";
import { AppContextProvider } from "./hooks/useAppContext";
import App from "./containers/App";
import "./style/reset.css";
import "./index.scss";

ReactDOM.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>,
  document.getElementById("root")
);
