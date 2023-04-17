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
      tabs[states.tab.name].value = value;

      localStorage.setItem("tabs", JSON.stringify(tabs));

      return { ...states, canShare: true, tabs };
    }
    case "insert": {
      const tabs = { ...states.tabs };
      tabs[tab] = {
        name: tab,
        value: value ?? mainFile
      };

      localStorage.setItem("tabs", JSON.stringify(tabs));

      return { ...states, tabs, tab: tabs[tab] };
    }
    case "tab": {
      const file = states.tabs[tab];

      return { ...states, tab: file, canShare: false, canRedo: false, canUndo: false };
    }
    case "rename": {
      let tabs = { ...states.tabs };

      const file = Object.values(tabs).find((file) => file.name === tab);
      file.name = value;

      delete tabs[tab];
      tabs = { ...tabs, [value]: file };

      localStorage.setItem("tabs", JSON.stringify(tabs));

      return { ...states, tabs };
    }
    case "delete": {
      const tabs = { ...states.tabs };
      delete tabs[tab];

      localStorage.setItem("tabs", JSON.stringify(tabs));

      return states.tab.name !== tab ? { ...states, tabs } : { ...states, tabs, tab: tabs[Object.keys(tabs)[0]] };
    }

    default:
      throw Error(`Action undefined: ${type}`);
  }
}

const mainFile = `await page.goto("https://browserless.io")

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
  tab: tabs["index.js"],
  tabs
};

export function useEditorStates() {
  return useContext(EditorContext);
}

export function useEditorStateDispatch() {
  return useContext(EditorDispatchContext);
}
