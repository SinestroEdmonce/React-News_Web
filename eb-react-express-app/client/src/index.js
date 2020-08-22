import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// Render all the content
ReactDOM.render(
    <App 
        defaultSource={(localStorage.getItem("defaultSource")? 
                        localStorage.getItem("defaultSource"): 
                        "guardian")}
    />,
    document.getElementById("main-ctn")
);
