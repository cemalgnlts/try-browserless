import { useCallback, useState, useRef, useEffect, lazy, Suspense } from "react";

import Navbar from "./components/navbar";
import FileTabs from "./components/filetabs";
import Toolbar from "./components/toolbar";
import Console from "./components/console";
import Loading from "./components/editor/Loading";

const Editor = lazy(() => import("./components/editor"));

import { useNavbarContext } from "./context/NavbarContext.jsx";
import { useEditorStates } from "./context/EditorContext";
import { useLogger } from "./context/LoggerContext";

import PuppeteerWorker from "./libs/worker.js?worker";

function Root() {
  const [editorUndo, setEditorUndo] = useState(null);
  const [editorRedo, setEditorRedo] = useState(null);
  const [browserStarted, setBrowserStarted] = useState(false);
  const { theme, isTabMenuVisible, isLogsVisible } = useNavbarContext();
  const { tab } = useEditorStates();
  const worker = useRef(null);
  const { logger } = useLogger();
  const popupWin = useRef(null);

  useEffect(() => {
    if (worker.current !== null) return;
    if (logger === null) return;

    const messageHandler = (msg) => {
      const { type, data } = msg.data;

      switch (type) {
        case "browserClosed": {
          setBrowserStarted(false);
          if (popupWin.current !== null) popupWin.current.close();
          logger.html(`<span class="log-small">Completed: ${(data / 1000).toFixed(2)} seconds.</span>`);
          break;
        }
        case "frame": {
          if (popupWin.current !== null) popupWin.current.postMessage(data.img);
          break;
        }
        case "log": {
          const { fun, args } = data;
          logger[fun](...args);
          break;
        }
      }
    };

    worker.current = new PuppeteerWorker();
    worker.current.onmessage = messageHandler;
    worker.current.onerror = (res) => {
      console.error(res);
      logger.error(res.message ?? res);
    };
  }, [logger]);

  const runBrowser = useCallback(async () => {
    setBrowserStarted(true);
    logger.clear();

    const data = {
      code: tab.value,
      options: JSON.parse(localStorage.getItem("options"))
    };

    if (data.options.livePreview) {
      popupWin.current = window.open("/live-preview.html", "Live Preview", "popup");
      if (popupWin.current === null) logger.error("The window wasn't allowed to open, This is likely caused by built-in popup blockers.");
    }

    worker.current.postMessage({ type: "run", data });
  });

  return (
    <div className="h-full flex flex-col" data-theme={theme}>
      <Navbar />
      <Toolbar runBrowser={runBrowser} browserStarted={browserStarted} editorUndo={editorUndo} editorRedo={editorRedo} />
      <div className="grow flex content">
        <aside className="bg-base-300 hidden z-10 lg:block" style={{ display: isTabMenuVisible && "flex" }}>
          <FileTabs />
        </aside>
        <main className="h-full grow overflow-hidden">
          <Suspense fallback={<Loading />}>
            <Editor setEditorUndo={setEditorUndo} setEditorRedo={setEditorRedo} />
          </Suspense>
        </main>
        <div className="bg-base-300 w-56 md:w-72 lg:w-80 -mt-8 xl:w-96 shrink-0 overflow-hidden z-[2] hidden md:block" style={{ display: isLogsVisible && "flex" }}>
          <Console logger={logger} />
        </div>
      </div>
    </div>
  );
}

export default Root;
