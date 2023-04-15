import { useCallback, useRef, useEffect, useState, memo } from "react";

import useDebounceCallback from "../../hooks/useDebounceCallback";
import { useEditorStateDispatch } from "../../context/EditorContext";

import configureMonaco from "./editorLoader";
import { default as MonacoEditor } from "@monaco-editor/react";

import Loading from "./Loading";

const template =
	localStorage.getItem("code") ??
	`await page.goto("https://deta.space")

const title = await page.title()

console.log(title)`;

function Editor({ setEditorUndo, setEditorRedo }) {
	const [debounceCallback] = useDebounceCallback(autoSave, 500);
	const dispatch = useEditorStateDispatch();
	const editorRef = useRef(null);
	const [version, setVersion] = useState(0);

	function autoSave(value) {
		localStorage.setItem("code", value);
		dispatch({ type: "canSave", value: true });
	}

	const onEditorMount = (editor, monaco) => {
		setEditorUndo(() => editor.trigger.bind(editor, "editor", "undo"));
		setEditorRedo(() => editor.trigger.bind(editor, "editor", "redo"));
		setVersion(editor.getModel().getAlternativeVersionId());
		editorRef.current = editor;

		if(!localStorage.getItem("code")) localStorage.setItem("code", template);
	};

	const onChange = useCallback((value) => {
		const versionId = editorRef.current.getModel().getAlternativeVersionId();
		let canUndo = false;
		let canRedo = false;

		if (versionId < version) {
			canRedo = true;
			if (versionId === 1) canUndo = false;
		} else {
			canUndo = true;
		}

		setVersion(versionId);
		debounceCallback(value, false, false);
		dispatch({ type: "canUndo", value: canUndo });
		dispatch({ type: "canRedo", value: canRedo });
	});

	return (
		<MonacoEditor
			height="100%"
			theme="dracula"
			language="javascript"
			value={template}
			beforeMount={configureMonaco}
			onMount={onEditorMount}
			onChange={onChange}
			loading={<Loading />}
			options={{
				minimap: { enabled: false },
				padding: { top: "20px" },
				scrollBeyondLastLine: false,
				automaticLayout: true,
			}}
		/>
	);
}

export default memo(Editor);
