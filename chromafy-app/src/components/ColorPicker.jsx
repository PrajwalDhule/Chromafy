import { React, useState, useEffect, useRef } from "react";

const ColorPicker = ({
  palettes,
  palettesRef,
  colorIndex,
  paletteIndex,
  paletteIndexRef,
  setPalettes,
  setLabelColors,
  setPaletteIndex,
}) => {
  const [hue, setHue] = useState(180);
  const [saturation, _setSaturation] = useState(50);
  const [lightness, _setLightness] = useState(50);
  const [callPointerHandler, setCallPointerHandler] = useState(false);

  const saturationRef = useRef(saturation);
  const lightnessRef = useRef(lightness);
  const colorIndexRef = useRef(colorIndex);

  const setSaturation = (saturationValue) => {
    saturationRef.current = saturationValue;
    _setSaturation(saturationValue);
  };
  const setLightness = (lightnessValue) => {
    lightnessRef.current = lightnessValue;
    _setLightness(lightnessValue);
  };

  const square = document.getElementById("saturation-lightness-picker");
  const pointer = document.getElementById("color-picker-pointer");

  useEffect(() => {
    // if (
    //   palettes &&
    //   paletteIndex &&
    //   colorIndex >= 0 &&
    //   palettes.length > 0 &&
    //   paletteIndex >= 0
    // ) {
    // console.log(palettes[paletteIndex][colorIndex], " ", colorIndex);
    const square = document.getElementById("saturation-lightness-picker");
    const pointer = document.getElementById("color-picker-pointer");
    setHue(palettes[paletteIndex][colorIndex].h);
    setSaturation(palettes[paletteIndex][colorIndex].s);
    setLightness(palettes[paletteIndex][colorIndex].l);

    const squareRect = square.getBoundingClientRect();
    let { x, y } = get_xy_from_sl(
      palettes[paletteIndex][colorIndex].s,
      palettes[paletteIndex][colorIndex].l
    );
    x *= (squareRect.width - 20) / 100;
    y *= (squareRect.height - 20) / 100;

    pointer.style.left = x + "px";
    pointer.style.top = squareRect.height - 20 - y + "px";
    // }
  }, [palettes, paletteIndex, colorIndex]);

  // useEffect(() => {
  //   console.log(callPointerHandler, " outside");
  //   if (document.documentElement.classList.contains("firstRunCompleted")) {
  //     console.log(callPointerHandler, " inside");
  //     handleSatLightPointerRelease(saturation, lightness);
  //   }
  // }, [callPointerHandler]);

  useEffect(() => {
    const square = document.getElementById("saturation-lightness-picker");
    square.addEventListener("mousedown", handleMouseDown);
    if (
      !document.documentElement.classList.contains("mouseup-event-attached")
    ) {
      document.addEventListener("mouseup", handleMouseUp);
      document.documentElement.classList.add("mouseup-event-attached");
    }
    if (
      !document.documentElement.classList.contains("mousemove-event-attached")
    ) {
      document.addEventListener("mousemove", handleMouseMove);
      document.documentElement.classList.add("mousemove-event-attached");
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.classList.remove("mouseup-event-attached");
      document.documentElement.classList.remove("mousemove-event-attached");
    };
  }, []);

  const handleMouseDown = () => {
    const square = document.getElementById("saturation-lightness-picker");
    square?.classList.add("isDragging");
  };

  const handleMouseUp = () => {
    const square = document.getElementById("saturation-lightness-picker");
    // const saturationValue = saturation;

    // console.log(paletteIndexRef.current, " outside ", palettesRef.current);
    console.log(colorIndexRef.current, " outside ");

    handleSatLightPointerRelease(
      saturationRef.current,
      lightnessRef.current,
      paletteIndexRef.current,
      palettesRef.current,
      colorIndexRef.current
    );

    square?.classList.remove("isDragging");
  };

  const handleMouseMove = (e) => {
    // console.log(isDragging, "\n", square, "\n", pointer);
    const square = document.getElementById("saturation-lightness-picker");
    const pointer = document.getElementById("color-picker-pointer");
    if (square && square.classList.contains("isDragging") && pointer) {
      const squareRect = square.getBoundingClientRect();
      const x = Math.min(
        Math.max(e.clientX - squareRect.left, 0),
        squareRect.width - 20
      );
      const y = Math.min(
        Math.max(e.clientY - squareRect.top, 0),
        squareRect.height - 20
      );

      pointer.style.left = x + "px";
      pointer.style.top = y + "px";

      const { saturation, lightness } = calculate_s_l(
        (x / (squareRect.width - 20)) * 100,
        (y / (squareRect.height - 20)) * 100
      );

      setSaturation(saturation);
      setLightness(lightness);

      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      pointer.style.backgroundColor = color;
    }
  };

  // if (square && !square.classList.contains("mousedown-event-attached")) {
  //   square.addEventListener("mousedown", handleMouseDown);
  //   square.classList.add("mousedown-event-attached");
  // }

  // if (!document.documentElement.classList.contains("mouseup-event-attached")) {
  //   document.addEventListener("mouseup", handleMouseUp);
  //   document.documentElement.classList.add("mouseup-event-attached");
  // }

  // if (
  //   !document.documentElement.classList.contains("mousemove-event-attached")
  // ) {
  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.documentElement.classList.add("mousemove-event-attached");
  // }

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

  const handleHueSliderRelease = (hueValue) => {
    let color = { ...palettes[paletteIndex][colorIndex], h: Number(hueValue) };
    let palette = [...palettes[paletteIndex].slice(0, colorIndex)];
    palette.push(color);
    palette.push(
      ...palettes[paletteIndex].slice(
        colorIndex + 1,
        palettes[paletteIndex].length
      )
    );

    console.log(palette);
    addPalette([...palette]);
  };

  const handleSatLightPointerRelease = (
    saturationValue,
    lightnessValue,
    paletteIndexValue,
    palettesValue,
    colorIndexValue
  ) => {
    // console.log(palettesValue, "", paletteIndexValue);
    console.log(colorIndexValue);
    const square = document.getElementById("saturation-lightness-picker");
    if (square?.classList.contains("isDragging")) {
      let color = {
        ...palettesValue[paletteIndexValue][colorIndexValue],
        s: saturationValue,
        l: lightnessValue,
      };
      let palette = [
        ...palettesValue[paletteIndexValue].slice(0, colorIndexValue),
      ];
      palette.push({ ...color });
      palette.push(
        ...palettesValue[paletteIndexValue].slice(
          colorIndexValue + 1,
          palettesValue[paletteIndexValue].length
        )
      );

      addPalette([...palette]);
    }
  };

  function setVariables(palette) {
    const colorTypes = ["text", "background", "primary", "secondary", "accent"];

    for (let i = 0; i < colorTypes.length; i++) {
      document.documentElement.style.setProperty(
        `--chroma-${colorTypes[i]}`,
        getColor(palette[i])
      );

      for (let j = 5; j <= 95; j = j + 5) {
        document.documentElement.style.setProperty(
          `--chroma-${colorTypes[i]}-${j}`,
          getColor(palette[i], j / 100)
        );
      }
    }
  }

  function getColor(colorObject, opacity = null) {
    if (colorObject.mode === "lch") {
      const l = colorObject.l;
      const c = colorObject.c;
      const h = colorObject.h;

      const rgbColor = chroma.lch(l, c, h).css();
      const hslColor = chroma(rgbColor).hsl();

      return hslColor;
    } else if (colorObject.mode === "hsl") {
      return opacity
        ? `hsla(${colorObject.h}, ${colorObject.s}%, ${colorObject.l}%, ${opacity})`
        : `hsl(${colorObject.h}, ${colorObject.s}%, ${colorObject.l}%)`;
    }
  }

  function addPalette(palette) {
    if (palette && palette.length > 0) {
      let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
      if (paletteIndexRef.current < colorState.length - 1) {
        colorState = colorState.slice(0, paletteIndexRef.current + 1);
      }
      colorState.push([...palette]);
      const len = colorState.length;
      if (len > 100) {
        colorState = colorState.slice(len - 100, len);
      }
      localStorage.setItem("chromafyColorState", JSON.stringify(colorState));
      let newPaletteIndex = Math.min(
        paletteIndexRef.current + 1,
        colorState.length - 1
      );
      setPaletteIndex(newPaletteIndex);
      setPalettes([...colorState]);
      setVariables([...palette]);
      setLabels([...palette]);
    }
  }

  function setLabels(palette) {
    const newLabelColors = palette.map((color) => {
      if (color.l < 50) return "hsl(360, 30%, 98%)";
      else return "hsl(360, 30%, 2%)";
    });
    setLabelColors([...newLabelColors]);
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
          onMouseUp={(e) => handleHueSliderRelease(e.target.value)}
          value={hue}
        />
      </div>
      <div className="">{hue}</div>
    </div>
  );
};

export default ColorPicker;
