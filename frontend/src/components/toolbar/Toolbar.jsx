import { useState } from "react";

import { useEditorStateDispatch, useEditorStates } from "../../context/EditorContext";

import { PlayIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon } from "@heroicons/react/24/outline";

import Options from "./Options";

function Toolbar({ browserStarted, runBrowser, editorUndo, editorRedo }) {
  const { canSave, canRedo, canUndo } = useEditorStates();
  const [saveStarted, setSaveStarted] = useState(false);
  const dispatch = useEditorStateDispatch();

  const onRedo = () => {
    editorRedo();
  };

  const onUndo = () => {
    editorUndo();
  };

  const onSave = async () => {
    setSaveStarted(true);
    // const { status, output } = await saveCode();
    setSaveStarted(false);

    // if (!status) alert(output);

    // dispatch({ type: "canSave", value: false });
  };

  const onPlay = () => runBrowser();

  return (
    <div className="flex bg-base-300">
      <div className="w-44 hidden lg:block"></div>
      <div className="tooltip" data-tip="Redo code edit">
        <button className="btn btn-sm btn-ghost gap-2" onClick={onUndo} disabled={!canUndo}>
          <ArrowUturnLeftIcon className="w-5 h-5 align-bottom" />
        </button>
      </div>
      <div className="tooltip" data-tip="Undo code edit">
        <button className="btn btn-sm btn-ghost gap-2" onClick={onRedo} disabled={!canRedo}>
          <ArrowUturnRightIcon className="w-5 h-5 align-bottom" />
        </button>
      </div>
      <div className="divider divider-horizontal mx-0"></div>
      <div className="tooltip" data-tip="Options">
        <Options />
      </div>
      {/* <div className="tooltip" data-tip="Save code">
        <button className={`btn btn-sm btn-ghost gap-2${saveStarted ? " loading" : ""}`} onClick={onSave} disabled={!canSave}>
          {!saveStarted && <ServerIcon className="w-5 h-5 align-bottom" />}
        </button>
      </div> */}
      <div className="divider divider-horizontal mx-0"></div>
      <button onClick={onPlay} className={`btn btn-sm btn-ghost gap-2 normal-case font-normal${browserStarted ? " loading" : ""}`}>
        {!browserStarted && <PlayIcon className="w-5 h-5" />}
        Run
      </button>
      {/* <div className="grow"></div> */}
      {/* <div className="w-56 md:w-72 lg:w-80 xl:w-96 hidden md:block"></div> */}
    </div>
  );
}

export default Toolbar;
