import React from "react";
import { useState, useEffect, useRef } from "react";
import ExportPopup from "./ExportPopup";

const Popup = () => {
  const [colorSchemeId, setColorSchemeId] = useState(-1);
  const [paletteIndex, setPaletteIndex] = useState(-1);
  // const [palette, setPalette] = useState([]);
  const [palettes, setPalettes] = useState([]);
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
  const [isFirstRun, setIsFirstRun] = useState(true);

  // localStorage.removeItem("chromafyColorState");
  // localStorage.removeItem("chromafyThemeState");

  useEffect(() => {
    localStorage.setItem("chromafyThemeState", JSON.stringify(theme));

    let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
    if (!colorState || colorState.length == 0) {
      const colorState = new Array();
      localStorage.setItem("chromafyColorState", JSON.stringify(colorState));
    }

    if (
      !window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--chroma-primary")
    ) {
      let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
      if (!colorState || colorState.length == 0) {
        generatePalette(-1, theme);
      } else {
        setPalettes([...colorState]);
        setPaletteIndex(colorState.length - 1);
        setVariables(colorState[colorState.length - 1]);
        setLabels(colorState[colorState.length - 1]);
      }
    }
  }, []);

  useEffect(() => {
    if (!isFirstRun) {
      let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
      if (colorState && colorState.length != 0) {
        localStorage.setItem("chromafyThemeState", JSON.stringify(theme));
        let colorPalette = [...colorState[colorState.length - 1]];
        for (let i = 0; i < colorPalette.length; i++) {
          colorPalette[i].l = 100 - colorPalette[i].l;
        }
        addPalette([...colorPalette]);
        // setPalette([...colorPalette]);
        // setCurrentPalette([...colorPalette]);
      }
    } else {
      setIsFirstRun(false);
    }
  }, [theme]);

  useEffect(() => {
    if (paletteIndex >= 0 && palettes && palettes.length > 0) {
      // console.log(paletteIndex, " ", palettes);
      setLabels([...palettes[paletteIndex]]);
      setVariables([...palettes[paletteIndex]]);
    }
  }, [paletteIndex]);

  useEffect(() => {
    // addRandomizeEvent();
    // addToggleSchemeOptionEvent();
    addSelectSchemeEvent();
    // addToggleThemeEvent();

    // return () => {
    // };
  }, []);

  function addPalette(palette) {
    if (palette && palette.length > 0) {
      let colorState = JSON.parse(localStorage.getItem("chromafyColorState"));
      if (paletteIndex < colorState.length - 1) {
        colorState = colorState.slice(0, paletteIndex);
      }
      colorState.push([...palette]);
      const len = colorState.length;
      if (len > 100) {
        colorState = colorState.slice(len - 100, len);
      }
      localStorage.setItem("chromafyColorState", JSON.stringify(colorState));
      setPaletteIndex((prevState) =>
        Math.min(prevState + 1, colorState.length - 1)
      );
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
      h: Math.random() * 360,
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
    // setPalette([textColor, bgColor, primaryColor, secondaryColor, accentColor]);
    // setCurrentPalette([textColor, bgColor, primaryColor, secondaryColor, accentColor]);
  }

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

    // set the values in the html
  }

  function removeReactApp() {
    // Find and remove the injected HTML content
    const reactApp = document.getElementById("main-chromafy-app");
    if (reactApp) {
      const confirmation = confirm("Close chromafy extension?");
      if (confirmation) reactApp.remove();
    }
  }

  function handleUndo() {}

  return (
    <>
      <div className="chromafy-wrapper" style={{ zIndex: 9999 }}>
        <div id="popup">
          <div
            className="color-box bg-chroma-text"
            // style={{ backgroundColor: "var(--chroma-text)" }}
          >
            <p style={{ color: labelColors[0] }}>Text</p>
          </div>

          <div
            className="color-box  bg-chroma-background"
            // style={{ backgroundColor: "var(--chroma-background)" }}
          >
            <p style={{ color: labelColors[1] }}>Background</p>
          </div>
          <div
            className="color-box bg-chroma-primary"
            // style={{ backgroundColor: "var(--chroma-primary)" }}
          >
            <p style={{ color: labelColors[2] }}>Primary</p>
          </div>
          <div
            className="color-box  bg-chroma-secondary"
            // style={{ backgroundColor: "var(--chroma-secondary)" }}
          >
            <p style={{ color: labelColors[3] }}>Secondary</p>
          </div>
          <div
            className="color-box bg-chroma-accent"
            // style={{ backgroundColor: "var(--chroma-accent)" }}
          >
            <p style={{ color: labelColors[4] }}>Accent</p>
          </div>
          <div
            style={{
              backgroundColor: `${
                theme == "dark" ? "rgb(20, 20, 20)" : "white"
              }`,
            }}
          >
            <button
              className="primary-button"
              id="themeButton"
              onClick={() => {
                setTheme((prevTheme) =>
                  prevTheme === "light" ? "dark" : "light"
                );
              }}
            >
              <svg
                style={{ display: theme === "dark" ? "none" : "grid" }}
                viewBox="0 0 460 460"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                id="lightThemeIcon"
              >
                <circle cx="230" cy="230" r="74" fill="black" />
                <rect
                  x="218"
                  y="3"
                  width="24"
                  height="106"
                  rx="12"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="457"
                  y="209"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(90 457 209)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="382.439"
                  y="61.7574"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(45 382.439 61.7574)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="3"
                  y="242"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(-90 3 242)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="60.7574"
                  y="78.728"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(-45 60.7574 78.728)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="242"
                  y="457"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(180 242 457)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="77.7279"
                  y="398.409"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(-135 77.7279 398.409)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
                <rect
                  x="399.409"
                  y="381.438"
                  width="24"
                  height="106"
                  rx="12"
                  transform="rotate(135 399.409 381.438)"
                  fill="black"
                  stroke="black"
                  stroke-width="6"
                />
              </svg>
              <svg
                style={{ display: theme === "light" ? "none" : "grid" }}
                viewBox="0 0 399 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                id="darkThemeIcon"
              >
                <path
                  d="M178.954 1.05649C173.5 0.582192 167.5 3.06882 164 9.48514C161 14.9849 160 24.1395 165.954 27.0565C240.454 63.5565 277.454 197.057 201.454 288.057C125.454 379.057 20.954 342.557 18.454 342.557C15.954 342.557 12.954 341.057 5.95399 347.557C0.353992 352.757 0.620659 360.39 1.45399 363.557C51.954 437.057 177.517 462.435 240.454 441.557C310 418.485 328.5 389.985 353.454 363.557C395.48 319.047 427.454 180.557 353.454 88.5565C279.454 -3.44347 190.454 2.05658 178.954 1.05649Z"
                  fill="#FAFAFA"
                  stroke="#FAFAFA"
                />
              </svg>
            </button>
          </div>
          <div
            style={{
              backgroundColor: `${
                theme == "dark" ? "rgb(20, 20, 20)" : "white"
              }`,
            }}
          >
            <button
              className="primary-button"
              id="randomizeButton"
              onClick={() => generatePalette(colorSchemeId, theme)}
            >
              <svg
                style={{ display: theme === "dark" ? "none" : "grid" }}
                viewBox="0 0 448 448"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="10"
                  y="10"
                  width="428"
                  height="428"
                  rx="50"
                  stroke="black"
                  stroke-width="20"
                />
                <circle
                  cx="330"
                  cy="319"
                  r="23"
                  fill="black"
                  stroke="black"
                  stroke-width="20"
                />
                <circle
                  cx="128"
                  cy="319"
                  r="23"
                  fill="black"
                  stroke="black"
                  stroke-width="20"
                />
                <circle
                  cx="128"
                  cy="127"
                  r="23"
                  fill="black"
                  stroke="black"
                  stroke-width="20"
                />
                <circle
                  cx="320"
                  cy="127"
                  r="23"
                  fill="black"
                  stroke="black"
                  stroke-width="20"
                />
                <circle
                  cx="224"
                  cy="224"
                  r="23"
                  fill="black"
                  stroke="black"
                  stroke-width="20"
                />
              </svg>
              <svg
                style={{ display: theme === "light" ? "none" : "block" }}
                viewBox="0 0 448 448"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M388 10H60C32.3858 10 10 32.3858 10 60V388C10 415.614 32.3858 438 60 438H388C415.614 438 438 415.614 438 388V60C438 32.3858 415.614 10 388 10Z"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M330 342C342.703 342 353 331.703 353 319C353 306.297 342.703 296 330 296C317.297 296 307 306.297 307 319C307 331.703 317.297 342 330 342Z"
                  fill="#FAFAFA"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M128 342C140.703 342 151 331.703 151 319C151 306.297 140.703 296 128 296C115.297 296 105 306.297 105 319C105 331.703 115.297 342 128 342Z"
                  fill="#FAFAFA"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M128 150C140.703 150 151 139.703 151 127C151 114.297 140.703 104 128 104C115.297 104 105 114.297 105 127C105 139.703 115.297 150 128 150Z"
                  fill="#FAFAFA"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M320 150C332.703 150 343 139.703 343 127C343 114.297 332.703 104 320 104C307.297 104 297 114.297 297 127C297 139.703 307.297 150 320 150Z"
                  fill="#FAFAFA"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
                <path
                  d="M224 247C236.703 247 247 236.703 247 224C247 211.297 236.703 201 224 201C211.297 201 201 211.297 201 224C201 236.703 211.297 247 224 247Z"
                  fill="#FAFAFA"
                  stroke="#FAFAFA"
                  stroke-width="20"
                />
              </svg>
            </button>
          </div>
          <div
            className="scheme-settings"
            style={{
              backgroundColor: `${
                theme == "dark" ? "rgb(20, 20, 20)" : "white"
              }`,
            }}
          >
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
              className="primary-button"
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
          <div className="">
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
              >
                <path
                  d="M375.305 149.031C377.359 155.332 373.916 162.105 367.615 164.159C361.314 166.213 354.541 162.77 352.487 156.469L375.305 149.031ZM230 19L233.124 7.41391L230 19ZM25.1291 131.648C18.5387 132.348 12.6287 127.573 11.9287 120.982L0.521276 13.5866C-0.17874 6.99628 4.59631 1.08628 11.1867 0.386263C17.777 -0.313753 23.687 4.4613 24.387 11.0516L34.527 106.515L129.99 96.3747C136.58 95.6747 142.49 100.45 143.19 107.04C143.89 113.63 139.115 119.54 132.525 120.24L25.1291 131.648ZM363.896 152.75C352.487 156.469 352.488 156.473 352.489 156.476C352.49 156.477 352.491 156.48 352.491 156.481C352.492 156.483 352.492 156.484 352.492 156.483C352.491 156.482 352.489 156.474 352.484 156.46C352.475 156.431 352.457 156.378 352.43 156.3C352.377 156.144 352.29 155.89 352.168 155.544C351.923 154.852 351.538 153.793 351.005 152.411C349.94 149.646 348.29 145.599 345.999 140.629C341.41 130.673 334.296 117.111 324.247 102.774C304.075 73.9976 272.694 42.9422 226.876 30.5861L233.124 7.41391C286.306 21.7558 321.873 57.5752 343.899 88.9987C354.949 104.762 362.747 119.632 367.795 130.582C370.322 136.066 372.171 140.591 373.401 143.785C374.017 145.382 374.478 146.649 374.793 147.538C374.95 147.983 375.071 148.333 375.156 148.584C375.199 148.709 375.232 148.81 375.257 148.884C375.27 148.922 375.28 148.953 375.288 148.977C375.292 148.989 375.295 149 375.298 149.009C375.3 149.013 375.301 149.019 375.302 149.021C375.304 149.026 375.305 149.031 363.896 152.75ZM226.876 30.5861C189.457 20.4951 157.959 24.469 127.709 40.4359C96.875 56.7116 66.702 85.7863 33.1956 127.257L14.5275 112.173C48.6596 69.9288 81.3058 37.7915 116.506 19.2112C152.291 0.322058 190.043 -4.20403 233.124 7.41391L226.876 30.5861Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
          <div className="">
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
              >
                <path
                  d="M0.5055 160.554C-1.3978 166.902 2.20554 173.591 8.55378 175.495C14.902 177.398 21.5912 173.794 23.4945 167.446L0.5055 160.554ZM146.001 18.4665L142.624 6.95124L142.624 6.95124L146.001 18.4665ZM350.55 139.927C357.107 140.893 363.206 136.361 364.172 129.804L379.917 22.9583C380.884 16.4017 376.352 10.3032 369.795 9.33701C363.239 8.37078 357.14 12.9027 356.174 19.4593L342.178 114.434L247.203 100.437C240.647 99.4711 234.548 104.003 233.582 110.56C232.616 117.116 237.148 123.215 243.704 124.181L350.55 139.927ZM12 164C23.4945 167.446 23.4934 167.45 23.4925 167.453C23.4924 167.453 23.4916 167.456 23.4913 167.457C23.4907 167.459 23.4907 167.459 23.4912 167.457C23.4922 167.454 23.4954 167.443 23.5006 167.426C23.5111 167.392 23.5301 167.33 23.5577 167.242C23.6129 167.065 23.7024 166.782 23.8273 166.399C24.0769 165.631 24.4673 164.464 25.0053 162.945C26.0819 159.906 27.7463 155.47 30.053 150.029C34.6745 139.129 41.8298 124.299 51.932 108.629C72.2542 77.1079 103.715 43.3702 149.377 29.9817L142.624 6.95124C89.2096 22.6128 53.6697 61.642 31.7607 95.6248C20.7474 112.707 12.9796 128.814 7.95675 140.662C5.44129 146.595 3.6033 151.486 2.38293 154.931C1.7725 156.654 1.31583 158.018 1.00554 158.971C0.850371 159.448 0.731739 159.822 0.648723 160.088C0.607213 160.221 0.5746 160.327 0.550769 160.405C0.538854 160.444 0.529133 160.476 0.521593 160.5C0.517823 160.513 0.514599 160.524 0.511917 160.532C0.510577 160.537 0.50897 160.542 0.508302 160.544C0.506833 160.549 0.5055 160.554 12 164ZM149.377 29.9817C186.578 19.074 217.848 23.3446 248.004 40.6514C278.848 58.3526 309.084 90.0183 342.668 135.212L361.932 120.897C327.825 75.0008 295.193 40.0615 259.95 19.8358C224.021 -0.78436 185.986 -5.76267 142.624 6.95124L149.377 29.9817Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
          <div>
            <button className="primary-button" onClick={() => removeReactApp()}>
              close
            </button>
          </div>
        </div>
      </div>
      <ExportPopup />
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
