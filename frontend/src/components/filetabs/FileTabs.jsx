import { memo, useState } from "react";
import { EllipsisVerticalIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEditorStateDispatch, useEditorStates } from "../../context/EditorContext";

function TabMenu() {
  const [showDialog, setShowDialog] = useState(false);
  const { tabs, tab } = useEditorStates();
  const dispatch = useEditorStateDispatch();

  const addFile = () => {
    dispatch({
      type: "save",
      tab: `${Date.now()}.js`,
      value: "console.log(1)"
    });
  };

  const changeTab = (ev) => {
    const tab = ev.target.dataset.tab;
    dispatch({ type: "tab", tab: tab });
  };

  const renameTab = (ev) => {
    const tab = ev.target.dataset.tab;
    dispatch({ type: "rename", tab, value: "" });
  };

  const deleteTab = (ev) => {
    const tab = ev.target.dataset.tab;
    dispatch({ type: "delete", tab });
  };

  return (
    <>
      <ul className="menu menu-compact text-md bg-base-300 w-44 -mt-8">
        <li className="text-lg mx-3 my-3 font-bold flex items-center flex-row">
          Files
          <button className="btn btn-circle btn-md btn-ghost items-center ml-auto" onClick={addFile}>
            <PlusIcon className="w-5 h-5" />
          </button>
        </li>
        {Object.values(tabs).map((file) => (
          <li className={`text-ellipsis overflow-hidden ${file.name === tab.name ? "bordered" : ""}`} key={file.name} data-tab={file.name} onClick={changeTab}>
            <a>
              <span>{file.name}</span>
              <div className="dropdown ml-auto">
                <label tabIndex={0} className="btn btn-circle btn-sm btn-ghost">
                  <EllipsisVerticalIcon className="w-6 h-6" />
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <span>
                      <PencilIcon className="w-5 h-5" />
                      Rename
                    </span>
                  </li>
                  <li>
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
    </>
  );
}

export default memo(TabMenu);
