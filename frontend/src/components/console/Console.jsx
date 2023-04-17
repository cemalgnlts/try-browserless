import { useEffect, memo, useRef } from "react";

import { useLogger } from "../../context/LoggerContext";

function Console() {
  const { logger, setLogger } = useLogger();
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current !== null) {
      if(logger !== null) return;
      
      const luna = new LunaConsole(consoleRef.current, {
        theme: "dark"
      });

      luna.html("<h1 class='font-bold text-2xl'>Try Browserless</h1>");
      luna.log("Puppeteer Docs: https://pptr.dev");
      luna.log("Browserless: https://browserless.io");
      luna.log("GitHub: https://github.com/cemalgnlts/try-browserless");

      setLogger(luna);
    }
  }, [consoleRef.current]);

  return <div ref={consoleRef} className="w-full h-full"></div>;
}

export default memo(Console);
