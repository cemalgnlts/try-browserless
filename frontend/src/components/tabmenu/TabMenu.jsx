import { memo } from "react";
import { EllipsisVerticalIcon, PlusIcon } from "@heroicons/react/24/outline";

function TabMenu() {
  return (
    <ul className="menu menu-compact text-md bg-base-300 w-44 -mt-8">
      <li className="text-lg mx-3 my-3 font-bold flex items-center flex-row">
        Files
        <button className="btn btn-circle btn-md btn-ghost items-center ml-auto">
          <PlusIcon className="w-5 h-5" />
        </button>
      </li>
      <li className="bordered">
        <a>
          <span>index.js</span>
          <button className="btn btn-circle btn-sm btn-ghost ml-auto">
            <EllipsisVerticalIcon className="w-6 h-6" />
          </button>
        </a>
      </li>
    </ul>
  );
}

export default memo(TabMenu);
