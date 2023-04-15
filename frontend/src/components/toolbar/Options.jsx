import { useState, useEffect } from "react";

import { Cog6ToothIcon } from "@heroicons/react/24/outline";

import devices from "./devices.json";

const savedOptions = localStorage.getItem("options")
  ? JSON.parse(localStorage.getItem("options"))
  : {
      headless: true,
      stealth: true,
      blockAds: true,
      livePreview: false,
      emulation: "no-emulation",
    };

function Options() {
  const [options, setOptions] = useState(savedOptions);

  useEffect(() => {
    // Trigger save.
    if(!localStorage.getItem("options")) setOptions({...options});
  }, []);

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
  }, [options]);

  const onOptionChanged = (ev) => {
    const { name, value, checked } = ev.target;
    setOptions({
      ...options,
      [name]: checked ?? value
    });
  };

  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-sm btn-ghost">
        <Cog6ToothIcon className="w-5 h-5 align-bottom" />
      </label>
      <div tabIndex={0} className="dropdown-content card card-compact w-64 p-2 bg-neutral shadow">
        <select name="emulation" value={options.emulation} className="select select-md mb-2" onChange={onOptionChanged}>
          <option value="no-emulation">Device Emulation</option>
          {devices.map((device, index) => (
            <option key={index} value={device}>
              {device}
            </option>
          ))}
        </select>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Live Preview</span>
            <input type="checkbox" name="livePreview" className="checkbox checkbox-sm" checked={options.livePreview} onChange={onOptionChanged} />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Headless</span>
            <input type="checkbox" name="headless" className="checkbox checkbox-sm" checked={options.headless} onChange={onOptionChanged} />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Stealth</span>
            <input type="checkbox" name="stealth" className="checkbox checkbox-sm" checked={options.stealth} onChange={onOptionChanged} />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Block ads</span>
            <input type="checkbox" name="blockAds" className="checkbox checkbox-sm" checked={options.blockAds} onChange={onOptionChanged} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Options;
