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
  // If Type is already defined, do not define it again.
  const extraLibs = monaco.languages.typescript.javascriptDefaults.getExtraLibs();
  if (extraLibs["node_modules/puppeteer-core/lib/types.d.ts"]) return;

  monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems: () => getSnippets(monaco.languages.CompletionItemKind.Snippet, monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet)
  });

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


function getSnippets(kind, insertTextRules) {
  return {
    suggestions: [
      {
        label: "log",
        insertText: 'console.log("$1")',
        documentation: 'console.log',
        insertTextRules,
        kind
      },
      {
        label: "go",
        insertText: 'await page.goto("$1")',
        documentation: 'page.goto',
        insertTextRules,
        kind
      },
      {
        label: "ss",
        insertText: 'await page.screenshot({ path: "$1.png" })',
        documentation: 'page.screenshot',
        insertTextRules,
        kind
      },
      {
        label: "ev",
        insertText: 'await page.evaluate(() => {\n\t$1\n})',
        documentation: 'page.evaluate',
        insertTextRules,
        kind
      },
    ]
  }
}