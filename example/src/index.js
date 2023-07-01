import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     <div id="joystickWrapper0">
        <div id="mobileInterface" className="noSelect">
          <div id="joystickWrapper1"></div>

          <div style={{ height: "100vh", width: "100%" }} />
        </div>
      </div>
    <App />
   
  </React.StrictMode>
);
