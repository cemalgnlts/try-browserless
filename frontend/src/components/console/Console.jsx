import { useRef, useEffect, memo } from "react";

function Console({ logger }) {
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current !== null) {
      logger.current = new LunaConsole(consoleRef.current, {
        theme: "dark"
      });

      logger.current.html("<h1 class='font-bold text-2xl'>Try Browserless</h1>");
      logger.current.log("Puppeteer Docs: https://pptr.dev");
      logger.current.log("Browserless: https://browserless.io");
      logger.current.log("GitHub: https://github.com/cemalgnlts/try-browserless");
    }
  }, [consoleRef.current]);

  return <div ref={consoleRef} className="w-full h-full"></div>;
}

export default memo(Console);
