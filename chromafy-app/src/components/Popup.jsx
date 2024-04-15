import React from "react";
import { useState, useEffect, useRef } from "react";
import ExportPopup from "./ExportPopup";
import ColorPicker from "./ColorPicker";
import themeBtnDark from "../assets/themeBtnDark.svg";
import themeBtnLight from "../assets/themeBtnLight.svg";
import randomizeBtnLight from "../assets/randomizeBtnLight.svg";
import randomizeBtnDark from "../assets/randomizeBtnDark.svg";

const Popup = () => {
  const [colorSchemeId, setColorSchemeId] = useState(-1);
  const [paletteIndex, _setPaletteIndex] = useState(-1);
  const [palettes, _setPalettes] = useState([]);
  const [labelColors, setLabelColors] = useState([
    "hsl(360, 30%, 98%)",
    "hsl(360, 30%, 2%)",
    "hsl(360, 30%, 2%)",
    "hsl(360, 30%, 2%)",
    "hsl(360, 30%, 2%)",
  ]);
  const [theme, setTheme] = useState(
    localStorage.getItem("chromafyThemeState")
      ? JSON.parse(localStorage.getItem("chromafyThemeState"))
      : "light"
  );
  const [colorPickerType, setColorPickerType] = useState("none");
  const [hasPageBeenRendered, setHasPageBeenRendered] = useState(false);

  const palettesRef = useRef(palettes);
  const paletteIndexRef = useRef(paletteIndex);

  const colorTypes = ["text", "background", "primary", "secondary", "accent"];

  const setPalettes = (palettesValue) => {
    palettesRef.current = palettesValue;
    _setPalettes(palettesValue);
    console.log(palettesValue);
  };
  const setPaletteIndex = (paletteIndexValue) => {
    paletteIndexRef.current = paletteIndexValue;
    _setPaletteIndex(paletteIndexValue);
    console.log(paletteIndexValue);
  };

  // localStorage.removeItem("chromafyColorState");
  // localStorage.removeItem("chromafyThemeState");

  useEffect(() => {
    try {
      localStorage.setItem("chromafyThemeState", JSON.stringify(theme));

      let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
      if (!colorState || colorState.length == 0) {
        const colorState = new Array();
        localStorage.setItem("chromafyColorState", JSON.stringify(colorState));
        generatePalette(-1, theme);
      } else {
        setPaletteIndex(colorState.length - 1);
        setPalettes([...colorState]);
        setVariables(colorState[colorState.length - 1]);
        setLabels(colorState[colorState.length - 1]);
        console.log([...colorState], colorState.length - 1, colorState);
      }

      const colorBoxes = document.querySelectorAll(".color-box");
      colorBoxes.forEach((box) => {
        if (!box.classList.contains("click-event-attached")) {
          box.addEventListener("click", function () {
            toggleColorBoxClass(this);
          });
          box.classList.add("click-event-attached");
        }
      });
    } catch (e) {
      console.log("Error occurred in localStorage handling:", e);
    }
  }, []);

  useEffect(() => {
    addSelectSchemeEvent();

    if (
      !document.documentElement.classList.contains(
        "export-popup-event-attached"
      )
    ) {
      document.addEventListener("click", handleExportPopupClick);
      document.documentElement.classList.add("export-popup-event-attached");
    }

    if (
      !document.documentElement.classList.contains("scheme-list-event-attached")
    ) {
      document.addEventListener("click", handleSchemeListClick);
      document.documentElement.classList.add("scheme-list-event-attached");
    }

    if (
      !document.documentElement.classList.contains(
        "color-picker-event-attached"
      )
    ) {
      document.addEventListener("click", handleColorPickerClick);
      document.documentElement.classList.add("color-picker-event-attached");
    }

    return () => {
      document.removeEventListener("click", handleExportPopupClick);
      document.documentElement.classList.remove("export-popup-event-attached");

      document.removeEventListener("click", handleSchemeListClick);
      document.documentElement.classList.remove("scheme-list-event-attached");

      document.removeEventListener("click", handleColorPickerClick);
      document.documentElement.classList.remove("color-picker-event-attached");
    };
  }, []);

  useEffect(() => {
    try {
      if (hasPageBeenRendered) {
        let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
        if (colorState && colorState.length != 0) {
          localStorage.setItem("chromafyThemeState", JSON.stringify(theme));
          let colorPalette = [...colorState[colorState.length - 1]];
          for (let i = 0; i < colorPalette.length; i++) {
            colorPalette[i].l = 100 - colorPalette[i].l;
          }
          addPalette([...colorPalette]);
        }
      } else {
        setHasPageBeenRendered(true);
      }
    } catch (e) {
      console.log("Error occurred in localStorage handling:", e);
    }
  }, [theme]);

  useEffect(() => {
    if (paletteIndex >= 0 && palettes && palettes.length > 0) {
      setLabels([...palettes[paletteIndex]]);
      setVariables([...palettes[paletteIndex]]);
    }
  }, [paletteIndex]);

  function handleExportPopupClick(event) {
    const exportPopup = document.getElementById("export-popup");
    const exportPopupBtn = document.getElementById("export-button");
    const chromafyWrapper = document.getElementById("chromafy-wrapper");
    const target = event.target;

    if (!exportPopupBtn.contains(target) && !exportPopup.contains(target)) {
      exportPopup.classList.remove("export-popup-open");
      chromafyWrapper.classList.remove("chromafy-overlay-open");
    }
  }

  function handleSchemeListClick(event) {
    const schemeList = document.getElementById("scheme-list");
    const schemeButton = document.getElementById("schemeButton");
    const target = event.target;

    if (!schemeList.contains(target) && !schemeButton.contains(target)) {
      schemeList.classList.remove("scheme-list-open");
    }
  }

  function handleColorPickerClick(event) {
    const colorBoxes = document.querySelectorAll(".color-box");
    const target = event.target;

    let isColorBoxClick = false;
    colorBoxes.forEach((colorBox) => {
      if (colorBox.contains(target)) {
        isColorBoxClick = true;
      }
    });

    if (!isColorBoxClick) {
      setColorPickerType("none");
    }
  }

  function addPalette(palette) {
    try {
      if (palette && palette.length > 0) {
        let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
        if (paletteIndex < colorState.length - 1) {
          colorState = colorState.slice(0, paletteIndex + 1);
        }
        colorState.push([...palette]);
        const len = colorState.length;
        if (len > 100) {
          colorState = colorState.slice(len - 100, len);
        }
        localStorage.setItem("chromafyColorState", JSON.stringify(colorState));
        const newPaletteIndex = Math.min(
          paletteIndex + 1,
          colorState.length - 1
        );
        setPaletteIndex(newPaletteIndex);
        setPalettes([...colorState]);
        setVariables([...palette]);
        setLabels([...palette]);
      }
    } catch (e) {
      console.log("Error occurred in localStorage handling:", e);
    }
  }

  function setLabels(palette) {
    const newLabelColors = palette.map((color) => {
      if (color.l < 50) return "hsl(360, 30%, 98%)";
      else return "hsl(360, 30%, 2%)";
    });
    setLabelColors([...newLabelColors]);
  }

  function adjustHue(val) {
    if (val < 0) val += Math.ceil(-val / 360) * 360;
    return val % 360;
  }

  function generatePalette(colorSchemeId = -1, theme = "light") {
    if (!(colorSchemeId <= 5 && colorSchemeId >= 0))
      colorSchemeId = Math.round(Math.random() * 5);

    const targetHueSteps = [
      { hueSteps: [0, 0, 0], name: "monochromatic" },
      { hueSteps: [0, 30, 60], name: "analogous" },
      { hueSteps: [0, 180, 180], name: "complementary" },
      { hueSteps: [0, 150, 210], name: "splitComplementary" },
      { hueSteps: [0, 120, 240], name: "triadic" },
      { hueSteps: [0, 90, 180, 270], name: "tetradic" },
    ];

    const primaryColor = {
      h: Math.round(Math.random() * 360),
      s: Math.round(Math.random() * 90) + 10,
      l:
        theme == "light"
          ? Math.round(Math.random() * 5) + 50
          : Math.round(Math.random() * 5) + 70,
      mode: "hsl",
    };

    const secondaryColor = {
      h: adjustHue(
        primaryColor.h +
          targetHueSteps[colorSchemeId].hueSteps[1] +
          (Math.round(Math.random() * 2) - 1) *
            (targetHueSteps[colorSchemeId].hueSteps[1] / 10)
      ),
      s: primaryColor.s,
      l:
        theme == "light"
          ? Math.round(Math.random() * 5) + 70
          : Math.round(Math.random() * 5) + 30,
      mode: "hsl",
    };

    const accentColor = {
      h: adjustHue(
        primaryColor.h +
          targetHueSteps[colorSchemeId].hueSteps[2] +
          (Math.round(Math.random() * 2) - 1) *
            (targetHueSteps[colorSchemeId].hueSteps[2] / 10)
      ),
      s: primaryColor.s,
      l:
        theme == "light"
          ? Math.round(Math.random() * 5) + 60
          : Math.round(Math.random() * 5) + 50,
      mode: "hsl",
    };

    const textColor = {
      h: adjustHue(primaryColor.h + Math.round(Math.random() * 10) - 5),
      s: primaryColor.s,
      l:
        theme == "light"
          ? Math.round(Math.random() * 4) + 1
          : 99 - Math.round(Math.random() * 4),
      mode: "hsl",
    };

    const bgColor = {
      h: adjustHue(primaryColor.h + Math.round(Math.random() * 10) - 5),
      s: primaryColor.s,
      l:
        theme == "light"
          ? 99 - Math.round(Math.random() * 4)
          : Math.round(Math.random() * 4) + 1,
      mode: "hsl",
    };

    addPalette([textColor, bgColor, primaryColor, secondaryColor, accentColor]);
  }

  function setVariables(palette) {
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

  function addSelectSchemeEvent() {
    let schemeOptions = document.getElementsByClassName("scheme-option");
    if (schemeOptions) {
      for (let i = 0; i < schemeOptions.length; i++) {
        let schemeOption = schemeOptions[i];
        schemeOption.addEventListener("click", function () {
          setColorSchemeId(
            parseInt(schemeOption.getAttribute("data-scheme-id"), 10)
          );
          selectScheme(schemeOptions, schemeOption);
        });
      }
    }
  }

  function selectScheme(schemeOptions, schemeOption) {
    for (let i = 0; i < schemeOptions.length; i++) {
      schemeOptions[i].classList.remove("scheme-option-selected");
    }
    schemeOption.classList.add("scheme-option-selected");
  }

  function addToggleThemeEvent() {
    document
      .getElementById("themeButton")
      .addEventListener("click", function () {
        console.log("theme button clicked");
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
      });
  }

  function toggleColorBoxClass(element) {
    const elements = document.querySelectorAll(".color-box");

    elements.forEach((el) => {
      if (el !== element) {
        el.classList.remove("color-box-active");
      }
    });
    element.classList.toggle("color-box-active");
  }

  function removeReactApp() {
    const reactApp = document.getElementById("main-chromafy-app");
    if (reactApp) {
      const confirmation = confirm("Close chromafy extension?");
      if (confirmation) reactApp.remove();
    }
  }

  return (
    <>
      <div
        className="chromafy-wrapper"
        id="chromafy-wrapper"
        style={{ zIndex: 9999 }}
        data-theme={theme}
      >
        <div id="chromafy-popup">
          {palettes &&
            paletteIndex >= 0 &&
            palettes[paletteIndex] &&
            colorTypes &&
            colorTypes.map((colorType, index) => {
              return (
                <div
                  className={`color-box action-button bg-chroma-${colorType} ${
                    colorPickerType == `${colorType}` ? "color-box-active" : ""
                  }`}
                >
                  {colorPickerType == `${colorType}` && (
                    // {true
                    <ColorPicker
                      palettes={palettes}
                      palettesRef={palettesRef}
                      colorIndex={index}
                      paletteIndex={paletteIndex}
                      paletteIndexRef={paletteIndexRef}
                      setPalettes={setPalettes}
                      setLabelColors={setLabelColors}
                      setPaletteIndex={setPaletteIndex}
                    />
                  )}
                  <p
                    style={{ color: labelColors[index] }}
                    onClick={() =>
                      setColorPickerType((prevState) =>
                        prevState == `${colorType}` ? "none" : `${colorType}`
                      )
                    }
                  >
                    {colorType.charAt(0).toUpperCase() + colorType.slice(1)}
                  </p>
                </div>
              );
            })}
          <div className="action-button">
            <button
              className="primary-button"
              id="themeButton"
              onClick={() => {
                setTheme((prevTheme) =>
                  prevTheme === "light" ? "dark" : "light"
                );
              }}
            >
              <img
                id="lightThemeIcon"
                src={themeBtnLight}
                alt="theme button light"
                style={{ display: theme === "dark" ? "none" : "grid" }}
              />
              <img
                id="darkThemeIcon"
                src={themeBtnDark}
                alt="theme button dark"
                style={{ display: theme === "light" ? "none" : "grid" }}
              />
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              id="randomizeButton"
              onClick={() => generatePalette(colorSchemeId, theme)}
            >
              <img
                src={randomizeBtnLight}
                alt="randomize button light"
                style={{ display: theme === "dark" ? "none" : "block" }}
              />
              <img
                src={randomizeBtnDark}
                alt="randomize button dark"
                style={{ display: theme === "light" ? "none" : "block" }}
              />
            </button>
          </div>
          <div className="scheme-settings action-button">
            <div id="scheme-list" className="scheme-list">
              <p>Choose a color scheme</p>
              <ul>
                <li
                  className="scheme-option scheme-option-selected"
                  data-scheme-id="-1"
                >
                  All
                </li>
                <li className="scheme-option" data-scheme-id="0">
                  Monochromatic
                </li>
                <li className="scheme-option" data-scheme-id="1">
                  Analogous
                </li>
                <li className="scheme-option" data-scheme-id="2">
                  Complementary
                </li>
                <li className="scheme-option" data-scheme-id="3">
                  Split Complementary
                </li>
                <li className="scheme-option" data-scheme-id="4">
                  Triadic
                </li>
              </ul>
            </div>
            <button
              className="primary-button action-button"
              id="schemeButton"
              onClick={() =>
                document
                  .getElementById("scheme-list")
                  .classList.toggle("scheme-list-open")
              }
            >
              <svg
                style={{ display: theme === "dark" ? "none" : "grid" }}
                viewBox="0 0 453 438"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M144.5 10H18C13.5817 10 10 13.5284 10 17.9467V355C10 381.5 25 428 82.5 428C132.5 428 152.333 379.5 152.5 355V18C152.5 13.5818 148.918 10 144.5 10Z"
                  stroke="black"
                  stroke-width="20"
                />
                <path
                  d="M376.362 160.064L286.955 70.6569C283.831 67.5327 278.73 67.5672 275.61 70.6953C207 139.474 221.065 128.663 206.465 143.263V338.763L376.319 171.419C379.483 168.302 379.502 163.204 376.362 160.064Z"
                  stroke="black"
                  stroke-width="20"
                />
                <path
                  d="M442.495 416.44V290C442.495 285.582 438.863 281.999 434.445 282.005C337.297 282.125 354.887 284.425 334.239 284.425L196 422.664L434.435 424.44C438.876 424.473 442.495 420.882 442.495 416.44Z"
                  stroke="black"
                  stroke-width="20"
                />
                <rect x="58.5" y="50" width="46" height="46" fill="black" />
                <rect
                  x="285.527"
                  y="133"
                  width="46"
                  height="46"
                  transform="rotate(45 285.527 133)"
                  fill="black"
                />
                <rect x="351" y="330" width="46" height="46" fill="black" />
                <rect x="58.5" y="166" width="46" height="46" fill="black" />
                <circle cx="81.5" cy="353" r="23" fill="black" />
              </svg>
              <svg
                style={{ display: theme === "light" ? "none" : "grid" }}
                viewBox="0 0 453 438"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M144.5 10H18C13.5817 10 10 13.5284 10 17.9467V355C10 381.5 25 428 82.5 428C132.5 428 152.333 379.5 152.5 355V18C152.5 13.5818 148.918 10 144.5 10Z"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M376.362 160.064L286.955 70.6568C283.831 67.5326 278.73 67.5671 275.61 70.6952C207 139.474 221.065 128.663 206.465 143.263V338.763L376.319 171.419C379.483 168.302 379.502 163.204 376.362 160.064Z"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M442.495 416.44V290C442.495 285.582 438.863 281.999 434.445 282.005C337.297 282.125 354.887 284.425 334.239 284.425L196 422.664L434.435 424.44C438.876 424.473 442.495 420.882 442.495 416.44Z"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path d="M105 50H59V96H105V50Z" fill="#FAFAFA" />
                <path
                  d="M319.054 165.527L286.527 133L254 165.527L286.527 198.054L319.054 165.527Z"
                  fill="#FAFAFA"
                />
                <path d="M397 330H351V376H397V330Z" fill="#FAFAFA" />
                <path d="M105 166H59V212H105V166Z" fill="#FAFAFA" />
                <path
                  d="M82 376C94.7025 376 105 365.703 105 353C105 340.297 94.7025 330 82 330C69.2975 330 59 340.297 59 353C59 365.703 69.2975 376 82 376Z"
                  fill="#FAFAFA"
                />
              </svg>
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              onClick={() => {
                setPaletteIndex(Math.max(0, paletteIndex - 1));
              }}
            >
              <svg
                width="376"
                height="165"
                viewBox="0 0 376 165"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: paletteIndex == 0 ? 0.5 : 1,
                  display: theme === "dark" ? "none" : "grid",
                }}
              >
                <path
                  d="M375.305 149.031C377.359 155.332 373.916 162.105 367.615 164.159C361.314 166.213 354.541 162.77 352.487 156.469L375.305 149.031ZM230 19L233.124 7.41391L230 19ZM25.1291 131.648C18.5387 132.348 12.6287 127.573 11.9287 120.982L0.521276 13.5866C-0.17874 6.99628 4.59631 1.08628 11.1867 0.386263C17.777 -0.313753 23.687 4.4613 24.387 11.0516L34.527 106.515L129.99 96.3747C136.58 95.6747 142.49 100.45 143.19 107.04C143.89 113.63 139.115 119.54 132.525 120.24L25.1291 131.648ZM363.896 152.75C352.487 156.469 352.488 156.473 352.489 156.476C352.49 156.477 352.491 156.48 352.491 156.481C352.492 156.483 352.492 156.484 352.492 156.483C352.491 156.482 352.489 156.474 352.484 156.46C352.475 156.431 352.457 156.378 352.43 156.3C352.377 156.144 352.29 155.89 352.168 155.544C351.923 154.852 351.538 153.793 351.005 152.411C349.94 149.646 348.29 145.599 345.999 140.629C341.41 130.673 334.296 117.111 324.247 102.774C304.075 73.9976 272.694 42.9422 226.876 30.5861L233.124 7.41391C286.306 21.7558 321.873 57.5752 343.899 88.9987C354.949 104.762 362.747 119.632 367.795 130.582C370.322 136.066 372.171 140.591 373.401 143.785C374.017 145.382 374.478 146.649 374.793 147.538C374.95 147.983 375.071 148.333 375.156 148.584C375.199 148.709 375.232 148.81 375.257 148.884C375.27 148.922 375.28 148.953 375.288 148.977C375.292 148.989 375.295 149 375.298 149.009C375.3 149.013 375.301 149.019 375.302 149.021C375.304 149.026 375.305 149.031 363.896 152.75ZM226.876 30.5861C189.457 20.4951 157.959 24.469 127.709 40.4359C96.875 56.7116 66.702 85.7863 33.1956 127.257L14.5275 112.173C48.6596 69.9288 81.3058 37.7915 116.506 19.2112C152.291 0.322058 190.043 -4.20403 233.124 7.41391L226.876 30.5861Z"
                  fill="black"
                />
              </svg>
              <svg
                width="376"
                height="165"
                viewBox="0 0 376 165"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: paletteIndex == 0 ? 0.5 : 1,
                  display: theme === "light" ? "none" : "grid",
                }}
              >
                <path
                  d="M375.305 149.031C377.359 155.332 373.916 162.105 367.615 164.159C361.314 166.213 354.541 162.77 352.487 156.469L375.305 149.031ZM230 19L233.124 7.41391L230 19ZM25.1291 131.648C18.5387 132.348 12.6287 127.573 11.9287 120.982L0.521276 13.5866C-0.17874 6.99628 4.59631 1.08628 11.1867 0.386263C17.777 -0.313753 23.687 4.4613 24.387 11.0516L34.527 106.515L129.99 96.3747C136.58 95.6747 142.49 100.45 143.19 107.04C143.89 113.63 139.115 119.54 132.525 120.24L25.1291 131.648ZM363.896 152.75C352.487 156.469 352.488 156.473 352.489 156.476C352.49 156.477 352.491 156.48 352.491 156.481C352.492 156.483 352.492 156.484 352.492 156.483C352.491 156.482 352.489 156.474 352.484 156.46C352.475 156.431 352.457 156.378 352.43 156.3C352.377 156.144 352.29 155.89 352.168 155.544C351.923 154.852 351.538 153.793 351.005 152.411C349.94 149.646 348.29 145.599 345.999 140.629C341.41 130.673 334.296 117.111 324.247 102.774C304.075 73.9976 272.694 42.9422 226.876 30.5861L233.124 7.41391C286.306 21.7558 321.873 57.5752 343.899 88.9987C354.949 104.762 362.747 119.632 367.795 130.582C370.322 136.066 372.171 140.591 373.401 143.785C374.017 145.382 374.478 146.649 374.793 147.538C374.95 147.983 375.071 148.333 375.156 148.584C375.199 148.709 375.232 148.81 375.257 148.884C375.27 148.922 375.28 148.953 375.288 148.977C375.292 148.989 375.295 149 375.298 149.009C375.3 149.013 375.301 149.019 375.302 149.021C375.304 149.026 375.305 149.031 363.896 152.75ZM226.876 30.5861C189.457 20.4951 157.959 24.469 127.709 40.4359C96.875 56.7116 66.702 85.7863 33.1956 127.257L14.5275 112.173C48.6596 69.9288 81.3058 37.7915 116.506 19.2112C152.291 0.322058 190.043 -4.20403 233.124 7.41391L226.876 30.5861Z"
                  fill="#FAFAFA"
                />
              </svg>
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              onClick={() => {
                setPaletteIndex(
                  Math.min(paletteIndex + 1, palettes.length - 1)
                );
              }}
            >
              <svg
                width="381"
                height="176"
                viewBox="0 0 381 176"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: paletteIndex == palettes.length - 1 ? 0.5 : 1,
                  display: theme === "dark" ? "none" : "grid",
                }}
              >
                <path
                  d="M0.5055 160.554C-1.3978 166.902 2.20554 173.591 8.55378 175.495C14.902 177.398 21.5912 173.794 23.4945 167.446L0.5055 160.554ZM146.001 18.4665L142.624 6.95124L142.624 6.95124L146.001 18.4665ZM350.55 139.927C357.107 140.893 363.206 136.361 364.172 129.804L379.917 22.9583C380.884 16.4017 376.352 10.3032 369.795 9.33701C363.239 8.37078 357.14 12.9027 356.174 19.4593L342.178 114.434L247.203 100.437C240.647 99.4711 234.548 104.003 233.582 110.56C232.616 117.116 237.148 123.215 243.704 124.181L350.55 139.927ZM12 164C23.4945 167.446 23.4934 167.45 23.4925 167.453C23.4924 167.453 23.4916 167.456 23.4913 167.457C23.4907 167.459 23.4907 167.459 23.4912 167.457C23.4922 167.454 23.4954 167.443 23.5006 167.426C23.5111 167.392 23.5301 167.33 23.5577 167.242C23.6129 167.065 23.7024 166.782 23.8273 166.399C24.0769 165.631 24.4673 164.464 25.0053 162.945C26.0819 159.906 27.7463 155.47 30.053 150.029C34.6745 139.129 41.8298 124.299 51.932 108.629C72.2542 77.1079 103.715 43.3702 149.377 29.9817L142.624 6.95124C89.2096 22.6128 53.6697 61.642 31.7607 95.6248C20.7474 112.707 12.9796 128.814 7.95675 140.662C5.44129 146.595 3.6033 151.486 2.38293 154.931C1.7725 156.654 1.31583 158.018 1.00554 158.971C0.850371 159.448 0.731739 159.822 0.648723 160.088C0.607213 160.221 0.5746 160.327 0.550769 160.405C0.538854 160.444 0.529133 160.476 0.521593 160.5C0.517823 160.513 0.514599 160.524 0.511917 160.532C0.510577 160.537 0.50897 160.542 0.508302 160.544C0.506833 160.549 0.5055 160.554 12 164ZM149.377 29.9817C186.578 19.074 217.848 23.3446 248.004 40.6514C278.848 58.3526 309.084 90.0183 342.668 135.212L361.932 120.897C327.825 75.0008 295.193 40.0615 259.95 19.8358C224.021 -0.78436 185.986 -5.76267 142.624 6.95124L149.377 29.9817Z"
                  fill="black"
                />
              </svg>
              <svg
                width="381"
                height="176"
                viewBox="0 0 381 176"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  opacity: paletteIndex == palettes.length - 1 ? 0.5 : 1,
                  display: theme === "light" ? "none" : "grid",
                }}
              >
                <path
                  d="M0.5055 160.554C-1.3978 166.902 2.20554 173.591 8.55378 175.495C14.902 177.398 21.5912 173.794 23.4945 167.446L0.5055 160.554ZM146.001 18.4665L142.624 6.95124L142.624 6.95124L146.001 18.4665ZM350.55 139.927C357.107 140.893 363.206 136.361 364.172 129.804L379.917 22.9583C380.884 16.4017 376.352 10.3032 369.795 9.33701C363.239 8.37078 357.14 12.9027 356.174 19.4593L342.178 114.434L247.203 100.437C240.647 99.4711 234.548 104.003 233.582 110.56C232.616 117.116 237.148 123.215 243.704 124.181L350.55 139.927ZM12 164C23.4945 167.446 23.4934 167.45 23.4925 167.453C23.4924 167.453 23.4916 167.456 23.4913 167.457C23.4907 167.459 23.4907 167.459 23.4912 167.457C23.4922 167.454 23.4954 167.443 23.5006 167.426C23.5111 167.392 23.5301 167.33 23.5577 167.242C23.6129 167.065 23.7024 166.782 23.8273 166.399C24.0769 165.631 24.4673 164.464 25.0053 162.945C26.0819 159.906 27.7463 155.47 30.053 150.029C34.6745 139.129 41.8298 124.299 51.932 108.629C72.2542 77.1079 103.715 43.3702 149.377 29.9817L142.624 6.95124C89.2096 22.6128 53.6697 61.642 31.7607 95.6248C20.7474 112.707 12.9796 128.814 7.95675 140.662C5.44129 146.595 3.6033 151.486 2.38293 154.931C1.7725 156.654 1.31583 158.018 1.00554 158.971C0.850371 159.448 0.731739 159.822 0.648723 160.088C0.607213 160.221 0.5746 160.327 0.550769 160.405C0.538854 160.444 0.529133 160.476 0.521593 160.5C0.517823 160.513 0.514599 160.524 0.511917 160.532C0.510577 160.537 0.50897 160.542 0.508302 160.544C0.506833 160.549 0.5055 160.554 12 164ZM149.377 29.9817C186.578 19.074 217.848 23.3446 248.004 40.6514C278.848 58.3526 309.084 90.0183 342.668 135.212L361.932 120.897C327.825 75.0008 295.193 40.0615 259.95 19.8358C224.021 -0.78436 185.986 -5.76267 142.624 6.95124L149.377 29.9817Z"
                  fill="#FAFAFA"
                />
              </svg>
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              id="export-button"
              onClick={() => {
                document
                  .getElementById("export-popup")
                  .classList.toggle("export-popup-open");
                document
                  .getElementById("chromafy-wrapper")
                  .classList.toggle("chromafy-overlay-open");

                console.log("clicked");
              }}
              style={{ color: theme == "dark" ? "white" : "black" }}
            >
              export
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              onClick={() => removeReactApp()}
              // style={{ color: theme == "dark" ? "white" : "black" }}
            >
              <svg
                width="470"
                height="470"
                viewBox="0 0 470 470"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 369.408L369.408 100"
                  stroke={theme == "dark" ? "white" : "black"}
                  stroke-width="36"
                  stroke-linecap="round"
                />
                <path
                  d="M100 100L369.408 369.408"
                  stroke={theme == "dark" ? "white" : "black"}
                  stroke-width="36"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <ExportPopup
          palette={palettes && paletteIndex >= 0 && palettes[paletteIndex]}
        />
      </div>

      <div class="bg-chroma-background background">
        <h1 className="fg-chroma-text">
          Test <span className="fg-chroma-accent">Colors</span> on your own
          Website with Chromafy
        </h1>
        <div className="">
          <button className="bg-chroma-secondary-30">
            <p className="fg-chroma-text">View Documentation</p>
          </button>
          <button className="bg-chroma-primary">
            <p className="fg-chroma-background">Download Extension</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default Popup;
