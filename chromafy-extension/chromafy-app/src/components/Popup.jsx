import React from "react";
import { useState, useEffect, useRef } from "react";
import ExportPopup from "./ExportPopup";
import ColorPicker from "./ColorPicker";
import InfoPopup from "./InfoPopup";
import themeBtnDark from "../assets/themeBtnDark.svg";
import themeBtnLight from "../assets/themeBtnLight.svg";
import schemeBtnLight from "../assets/schemeBtnLight.svg";
import schemeBtnDark from "../assets/schemeBtnDark.svg";
import undoBtnLight from "../assets/undoBtnLight.svg";
import undoBtnDark from "../assets/undoBtnDark.svg";
import redoBtnLight from "../assets/redoBtnLight.svg";
import redoBtnDark from "../assets/redoBtnDark.svg";
import generateBtnLight from "../assets/generateBtnLight.svg";
import generateBtnDark from "../assets/generateBtnDark.svg";
import exportBtnLight from "../assets/exportBtnLight.svg";
import exportBtnDark from "../assets/exportBtnDark.svg";
import infoBtnLight from "../assets/infoBtnLight.svg";
import infoBtnDark from "../assets/infoBtnDark.svg";
import closeBtnLight from "../assets/closeBtnLight.svg";
import closeBtnDark from "../assets/closeBtnDark.svg";
import classNameExample from "../assets/class_name_example.svg";
import cssVariableExample from "../assets/css_variable_example.svg";

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
  };
  const setPaletteIndex = (paletteIndexValue) => {
    paletteIndexRef.current = paletteIndexValue;
    _setPaletteIndex(paletteIndexValue);
  };

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
    const infoPopup = document.getElementById("info-popup");
    const chromafyUi = document.getElementById("chromafy-popup");
    const chromafyWrapper = document.getElementById("chromafy-wrapper");
    const target = event.target;

    if (
      !chromafyUi?.contains(target) &&
      !exportPopup?.contains(target) &&
      !infoPopup?.contains(target)
    ) {
      exportPopup?.classList.remove("popup-open");
      infoPopup?.classList.remove("popup-open");
      chromafyWrapper?.classList.remove("chromafy-overlay-open");
    }
  }

  function handleToggleOverlay() {
    let chromafyWrapper = document.getElementById("chromafy-wrapper");
    if (
      document
        .getElementById("export-popup")
        ?.classList.contains("popup-open") ||
      document.getElementById("info-popup")?.classList.contains("popup-open")
    ) {
      if (!chromafyWrapper.classList.contains("chromafy-overlay-open")) {
        chromafyWrapper.classList.add("chromafy-overlay-open");
      }
    } else {
      chromafyWrapper.classList.remove("chromafy-overlay-open");
    }
  }

  function handleSchemeListClick(event) {
    const schemeList = document.getElementById("scheme-list");
    const schemeButton = document.getElementById("schemeButton");
    const target = event.target;

    if (!schemeList?.contains(target) && !schemeButton?.contains(target)) {
      schemeList?.classList.remove("scheme-list-open");
    }
  }

  function handleColorPickerClick(event) {
    const colorBoxes = document.querySelectorAll(".color-box");
    const target = event.target;

    let isColorBoxClick = false;
    colorBoxes?.forEach((colorBox) => {
      if (colorBox?.contains(target)) {
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
      if (confirmation) {
        // const cssIds = ["chromafy-self-css-style", "chromafy-inject-css-style"];
        reactApp.remove();
        // cssIds.forEach((id) => {
        //   const existingStyle = document.querySelector(`head link#${id}`);
        //   if (existingStyle) {
        //     document.head.removeChild(existingStyle);
        //   }
        // });
      }
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
                  className={`color-box action-button ${
                    colorPickerType == `${colorType}` ? "color-box-active" : ""
                  }`}
                  style={{ backgroundColor: `var(--chroma-${colorType})` }}
                >
                  {colorPickerType == `${colorType}` && (
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
              <img
                src={schemeBtnLight}
                alt="scheme btn icon light"
                style={{ display: theme === "dark" ? "none" : "grid" }}
              />
              <img
                src={schemeBtnDark}
                alt="scheme btn icon dark"
                style={{ display: theme === "light" ? "none" : "grid" }}
              />
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              onClick={() => {
                setPaletteIndex(Math.max(0, paletteIndex - 1));
              }}
            >
              <img
                src={undoBtnLight}
                alt="undo btn icon light"
                style={{
                  opacity: paletteIndex == 0 ? 0.5 : 1,
                  display: theme === "dark" ? "none" : "grid",
                }}
              />
              <img
                src={undoBtnDark}
                alt="undo btn icon dark"
                style={{
                  opacity: paletteIndex == 0 ? 0.5 : 1,
                  display: theme === "light" ? "none" : "grid",
                }}
              />
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
              <img
                src={redoBtnLight}
                alt="redo btn icon light"
                style={{
                  opacity: paletteIndex == palettes.length - 1 ? 0.5 : 1,
                  display: theme === "dark" ? "none" : "grid",
                }}
              />
              <img
                src={redoBtnDark}
                alt="redo btn icon dark"
                style={{
                  opacity: paletteIndex == palettes.length - 1 ? 0.5 : 1,
                  display: theme === "light" ? "none" : "grid",
                }}
              />
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              id="generateButton"
              onClick={() => generatePalette(colorSchemeId, theme)}
              style={{ color: theme == "dark" ? "#FAFAFA" : "black" }}
            >
              <img
                src={generateBtnLight}
                alt="generate button light"
                style={{ display: theme === "dark" ? "none" : "block" }}
              />
              <img
                src={generateBtnDark}
                alt="generate button dark"
                style={{ display: theme === "light" ? "none" : "block" }}
              />
              generate
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              id="export-button"
              onClick={() => {
                document
                  .getElementById("export-popup")
                  .classList.toggle("popup-open");
                handleToggleOverlay();
              }}
              style={{ color: theme == "dark" ? "#FAFAFA" : "black" }}
            >
              <img
                src={exportBtnLight}
                alt="export btn icon light"
                style={{
                  display: theme === "dark" ? "none" : "grid",
                }}
              />
              <img
                src={exportBtnDark}
                alt="export btn icon dark"
                style={{
                  display: theme === "light" ? "none" : "grid",
                }}
              />
              export
            </button>
          </div>
          <div className="action-button">
            <button
              className="primary-button"
              onClick={() => {
                document
                  .getElementById("info-popup")
                  .classList.toggle("popup-open");
                handleToggleOverlay();
              }}
            >
              <img
                src={infoBtnLight}
                alt="close btn icon light"
                style={{ display: theme === "dark" ? "none" : "grid" }}
                className="info-icon"
              />
              <img
                src={infoBtnDark}
                alt="close btn icon dark"
                style={{ display: theme === "light" ? "none" : "grid" }}
                className="info-icon"
              />
            </button>
          </div>
          <div className="close-btn action-button">
            <button onClick={() => removeReactApp()}>
              <img
                src={closeBtnLight}
                alt="close btn icon light"
                style={{ display: theme === "dark" ? "none" : "grid" }}
              />
              <img
                src={closeBtnDark}
                alt="close btn icon dark"
                style={{ display: theme === "light" ? "none" : "grid" }}
              />
            </button>
          </div>
          {/* <div className="close action-button">
            <button onClick={() => removeReactApp()}>
              <img
                src={closeBtnLight}
                alt="close btn icon light"
                style={{ display: theme === "dark" ? "none" : "grid" }}
              />
              <img
                src={closeBtnDark}
                alt="close btn icon dark"
                style={{ display: theme === "light" ? "none" : "grid" }}
              />
            </button>
          </div> */}
        </div>
        <ExportPopup
          palette={palettes && paletteIndex >= 0 && palettes[paletteIndex]}
        />
        <InfoPopup
          classNameExample={classNameExample}
          cssVariableExample={cssVariableExample}
        />
      </div>
    </>
  );
};

export default Popup;
