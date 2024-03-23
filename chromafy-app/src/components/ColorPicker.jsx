import { React, useState } from "react";

const ColorPicker = () => {
  const [hue, setHue] = useState(180);
  return (
    <div className="color-picker">
      <div></div>
      <div className="hue-slider">
        <div className="hue-display"></div>
        <input
          type="range"
          min={0}
          max={360}
          id="hue-range"
          onChange={(e) => setHue(e.target.value)}
        />
      </div>
      <div className="">{hue}</div>
    </div>
  );
};

export default ColorPicker;
