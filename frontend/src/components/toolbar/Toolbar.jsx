import { useState } from "react";

import { useEditorStateDispatch, useEditorStates } from "../../context/EditorContext";
import { useLogger } from "../../context/LoggerContext";

import { PlayIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, ShareIcon } from "@heroicons/react/24/outline";

import Options from "./Options";

import { shareCode } from "../../libs/api";

function Toolbar({ browserStarted, runBrowser, editorUndo, editorRedo }) {
  const { canShare, canRedo, canUndo, tab } = useEditorStates();
  const [shareStarted, canShareStarted] = useState(false);
  const dispatch = useEditorStateDispatch();
  const { logger } = useLogger();

  const onShare = async () => {
    canShareStarted(true);

    try {
      const code = await shareCode(tab.name, tab.value);
      logger.log("Share code:", code);
      logger.log("Expires after one day.");
    } catch(err) {
      console.error(err);
      logger.error(err);
    }

    canShareStarted(false);

    dispatch({ type: "canShare", value: false });
  };

  const onRedo = () => editorRedo();
  const onUndo = () => editorUndo();
  const onPlay = () => runBrowser();

  return (
    <div className="flex bg-base-300">
      <div className="w-48 hidden lg:block"></div>
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
      <div className="tooltip" data-tip="Share code">
        <button className={`btn btn-sm btn-ghost gap-2${shareStarted ? " loading" : ""}`} onClick={onShare} disabled={!canShare}>
          {!shareStarted && <ShareIcon className="w-5 h-5 align-bottom" />}
        </button>
      </div>
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
