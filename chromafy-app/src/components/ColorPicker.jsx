import { React, useState, useEffect } from "react";

const ColorPicker = (props) => {
  const [hue, setHue] = useState(180);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(50);

  const square = document.getElementById("saturation-lightness-picker");
  const pointer = document.getElementById("color-picker-pointer");

  useEffect(() => {
    if (square && pointer) {
      setHue(props.color.h);
      setSaturation(props.color.s);
      setLightness(props.color.l);

      const squareRect = square.getBoundingClientRect();
      let { x, y } = get_xy_from_sl(props.color.s, props.color.l);
      x *= (squareRect.width - 20) / 100;
      y *= (squareRect.height - 20) / 100;

      pointer.style.left = x + "px";
      pointer.style.top = squareRect.height - 20 - y + "px";
    }
  }, [props.color]);

  let isDragging = false;

  square?.addEventListener("mousedown", (e) => {
    isDragging = true;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  square?.addEventListener("mousemove", (e) => {
    if (isDragging && square && pointer) {
      const squareRect = square.getBoundingClientRect();
      const x = Math.min(
        Math.max(e.clientX - squareRect.left, 0),
        squareRect.width - 20
      );
      const y = Math.min(
        Math.max(e.clientY - squareRect.top, 0),
        squareRect.height - 20
      );

      // Update pointer position
      pointer.style.left = x + "px";
      pointer.style.top = y + "px";

      const { saturation, lightness } = calculate_s_l(
        (x / (squareRect.width - 20)) * 100,
        (y / (squareRect.height - 20)) * 100
      );

      setSaturation(saturation);
      setLightness(lightness);

      // Calculate saturation (S) and lightness (L) based on pointer position
      // const saturation = (x / (squareRect.width - 20)) * 100;
      // const lightness = 100 - (y / (squareRect.height - 20)) * 100;

      // Calculate hue (H) based on angle
      // const angle = Math.atan2(
      //   y - squareRect.height / 2,
      //   x - squareRect.width / 2
      // );
      // let hue = angle * (180 / Math.PI);
      // if (hue < 0) {
      //   hue += 360;
      // }
      // Update color display
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      pointer.style.backgroundColor = color;

      // Log HSL value
      // console.log(color);
    }
  });

  function calculate_s_l(x, y) {
    // let s1 = 38,
    //   s2 = 100,
    //   s3 = 100,
    //   s4 = 0;

    // let l1 = 100,
    //   l2 = 50,
    //   l3 = 0,
    //   l4 = 0;

    // let weight_x = 1 - x;
    // let weight_y = 1 - y;

    // let s = (s1 * weight_x + s2 * x) * weight_y + (s3 * x + s4 * weight_x) * y;
    // let l = (l1 * weight_x + l2 * x) * weight_y + (l3 * x + l4 * weight_x) * y;

    // console.log(s + " " + l);

    const hsv_value = 1 - y / 100;
    const hsv_saturation = x / 100;
    let lightness = (hsv_value / 2) * (2 - hsv_saturation);
    let saturation =
      (hsv_value * hsv_saturation) / (1 - Math.abs(2 * lightness - 1));

    saturation *= 100;
    lightness *= 100;

    return { saturation, lightness };
  }

  function get_xy_from_sl(saturation, lightness) {
    saturation /= 100;
    lightness /= 100;

    let y =
      (200 * lightness -
        200 +
        100 * (saturation - saturation * Math.abs(2 * lightness - 1))) /
      -2;
    let x = -1 * (100 * ((200 * lightness) / (100 - y) - 2));

    y = 100 - y;

    // console.log(x + " " + y);
    return { x, y };
  }

  return (
    <div className="color-picker">
      <div
        className="saturation-lightness-picker"
        id="saturation-lightness-picker"
      >
        <div className="layer-white layer"></div>
        <div className="layer-black layer"></div>
        <div
          className="layer-hue layer"
          style={{ backgroundColor: hue ? `hsl(${hue}, 100%, 50%)` : "" }}
        ></div>
        <div
          id="color-picker-pointer"
          style={{
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          }}
        ></div>
      </div>
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
