import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import EditorProvider from "./context/EditorContext";
import NavbarContextProvider from "./context/NavbarContext";
import LoggerProvider from "./context/LoggerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
	<EditorProvider>
		<NavbarContextProvider>
			<LoggerProvider>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</LoggerProvider>
		</NavbarContextProvider>
	</EditorProvider>
);
