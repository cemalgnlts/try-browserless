import { createContext, useContext, useReducer } from "react";

const EditorContext = createContext(null);
const EditorDispatchContext = createContext(null);

export default function EditorProvider({ children }) {
  const [states, dispatch] = useReducer(editorReducer, initialStates);

  return (
    <EditorContext.Provider value={states}>
      <EditorDispatchContext.Provider value={dispatch}>{children}</EditorDispatchContext.Provider>
    </EditorContext.Provider>
  );
}

function editorReducer(states, { type, value, tab }) {
  switch (type) {
    case "canShare": {
      if (states.canShare === value) return states;

      return { ...states, canShare: value };
    }
    case "canRedo": {
      if (states.canRedo === value) return states;

      return { ...states, canRedo: value };
    }
    case "canUndo": {
      if (states.canUndo === value) return states;

      return { ...states, canUndo: value };
    }
    case "save": {
      const tabs = { ...states.tabs };
      tabs[tab] = { name: tab, value };

      localStorage.setItem("tabs", JSON.stringify(tabs));
      return { ...states, canShare: true, tabs };
    }
    case "tab": {
      const tab = states.tabs[tab];
      return { ...states, tab };
    }
    case "rename": {
      const tabs = { ...states.tabs };
      const tab = tabs.find((file) => file.name === tab);
      delete tabs[tab.name];
      tabs = { ...tabs, tab };
      
      return { ...states, tabs };
    }
    case "delete": {
      const tabs = states.tabs.filter((file) => file.name !== tab);
      localStorage.setItem("tabs", JSON.stringify(tabs));
      return { ...states, tabs };
    }

    default:
      throw Error(`Action undefined: ${type}`);
  }
}

const mainFile = `await page.goto("https://deta.space")

const title = await page.title()

console.log(title)`;

const tabs = localStorage.getItem("tabs")
  ? JSON.parse(localStorage.getItem("tabs"))
  : {
      "index.js": {
        name: "index.js",
        value: mainFile
      }
    };

const initialStates = {
  canRedo: false,
  canUndo: false,
  canShare: false,
  tab: files["index.js"],
  tabs
};

export function useEditorStates() {
  return useContext(EditorContext);
}

export function useEditorStateDispatch() {
  return useContext(EditorDispatchContext);
}
