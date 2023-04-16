import { memo, useCallback, useEffect, useRef, useState } from "react";
import { EllipsisVerticalIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEditorStateDispatch, useEditorStates } from "../../context/EditorContext";

function TabMenu() {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedTab, setSelectedTab] = useState("");
  const { tabs, tab } = useEditorStates();
  const dispatch = useEditorStateDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (showRenameDialog === true) {
      setTimeout(() => {
        inputRef.current.setSelectionRange(0, fileName.lastIndexOf("."));
        inputRef.current.focus();
      }, 50);
    }
  }, [showRenameDialog]);

  const changeTab = (ev) => {
    const file = ev.currentTarget.dataset.tab;

    if (ev.target.matches("svg") || tab.name === file) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    dispatch({ type: "tab", tab: file });
  };

  const openRenameDialog = (ev) => {
    ev.stopPropagation();

    const fileName = ev.target.closest("li[data-tab]").dataset.tab;
    setSelectedTab(fileName);
    setFileName(fileName);
    setShowRenameDialog(true);
  };

  const closeRenameDialog = () => setShowRenameDialog(false);
  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const addFile = () => {
    setSelectedTab("");
    setFileName("script.js");
    setShowRenameDialog(true);
  };

  const renameDialogOk = useCallback(() => {
    setShowRenameDialog(false);

    if (tabs[fileName]) {
      return alert("The file with this name already exists!");
    }

    const type = selectedTab ? "rename" : "insert";
    dispatch({ type, tab: selectedTab, value: fileName });
  });

  const openDeleteDialog = (ev) => {
    ev.stopPropagation();

    const fileName = ev.target.closest("li[data-tab]").dataset.tab;
    setFileName(fileName);
    setShowDeleteDialog(true);
  };

  const deleteDialogOk = () => {
    setShowDeleteDialog(false);

    dispatch({ type: "delete", tab: fileName });
  };

  return (
    <>
      <ul className="menu menu-compact text-md bg-base-300 w-48 -mt-8">
        <li className="text-lg mx-3 my-3 font-bold flex items-center flex-row">
          Files
          <button className="btn btn-circle btn-md btn-ghost items-center ml-auto" onClick={addFile}>
            <PlusIcon className="w-5 h-5" />
          </button>
        </li>
        {Object.values(tabs).map((file) => (
          <li className={`w-full ${file.name === tab.name ? "bordered" : ""}`} key={file.name} data-tab={file.name} onClick={changeTab}>
            <a className="w-full">
              <span className="overflow-hidden text-ellipsis">{file.name}</span>
              <div className="dropdown ml-auto">
                <label tabIndex={0} className="btn btn-circle btn-sm btn-ghost">
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu menu-compact p-2 bg-neutral shadow rounded-box w-40">
                  <li onClick={openRenameDialog}>
                    <span>
                      <PencilIcon className="w-5 h-5" />
                      Rename
                    </span>
                  </li>
                  <li className="text-error" onClick={openDeleteDialog}>
                    <span>
                      <TrashIcon className="w-5 h-5" />
                      Delete
                    </span>
                  </li>
                </ul>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <input type="checkbox" checked={showRenameDialog} className="modal-toggle" />
      <div className="modal z-50">
        <div className="modal-box max-w-xs">
          <h3 className="font-bold text-lg">{selectedTab ? "Rename" : "New File"}</h3>
          <input ref={inputRef} type="text" placeholder="File name" className="input input-bordered w-full max-w-xs mt-4" value={fileName} onChange={(ev) => setFileName(ev.target.value)} />
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={closeRenameDialog}>
              Cancel
            </button>
            <button className="btn" onClick={renameDialogOk}>
              OK
            </button>
          </div>
        </div>
      </div>

      <input type="checkbox" checked={showDeleteDialog} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg">Delete</h3>
          <p className="py-4">
            Do you want to delete this file <strong>{fileName}</strong>?
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={closeDeleteDialog}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={deleteDialogOk}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(TabMenu);
