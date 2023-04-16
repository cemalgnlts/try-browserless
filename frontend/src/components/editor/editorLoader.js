// import { loader } from "@monaco-editor/react";

/*import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";*/

import draculaTheme from "./draculaTheme.json";
import puppeteerLibSource from "puppeteer-core/lib/types.d.ts?raw";

/*self.MonacoEnvironment = {
	getWorker(_, label) {
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};*/

export default function configureMonaco(monaco) {
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true
  });

  let puppeteerTypes = puppeteerLibSource.replace(/^import.*;$/gm, "").replace(/export /g, "declare ");

  puppeteerTypes = `${puppeteerTypes}
/** Page provides methods to interact with a single tab or extension background page in Chromium. */
declare const page: Page;";`;

  const puppeteerLibUri = "node_modules/puppeteer-core/lib/types.d.ts";
  monaco.languages.typescript.javascriptDefaults.addExtraLib(puppeteerTypes, puppeteerLibUri);
  monaco.editor.createModel(puppeteerTypes, "typescript", monaco.Uri.parse(puppeteerLibUri));

  monaco.editor.defineTheme("dracula", draculaTheme);
  monaco.editor.setTheme("dracula");
}
