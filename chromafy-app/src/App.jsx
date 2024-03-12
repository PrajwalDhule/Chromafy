import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Popup from "./components/Popup";
import { css } from "chroma-js";

function App() {
  const [count, setCount] = useState(0);
  const [colorSchemeId, setColorSchemeId] = useState(-1);
  const [palette, setPalette] = useState([
    { h: 208, s: 45, l: 6, mode: "hsl" },
    { h: 206, s: 47, l: 97, mode: "hsl" },
    { h: 205, s: 45, l: 55, mode: "hsl" },
    { h: 283, s: 46, l: 75, mode: "hsl" },
    { h: 313, s: 45, l: 63, mode: "hsl" },
  ]);

  //   --text: hsl(208, 45%, 6%);
  // --background: hsl(206, 47%, 97%);
  // --primary: hsl(205, 45%, 55%);
  // --secondary: hsl(283, 46%, 75%);
  // --accent: hsl(313, 45%, 63%);

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

  function appyColors(palette) {
    let injectedStyleSheet;

    // Function to inject CSS using insertRule
    function injectCSS() {
      injectedStyleSheet = document.createElement("style");
      document.head.appendChild(injectedStyleSheet);

      const styleSheet = injectedStyleSheet.sheet;
      const cssRule =
        ".bg-chroma-primary { background-color: var(--chroma-primary); }";
      styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
    }

    // Function to remove injected CSS
    function removeCSS() {
      if (injectedStyleSheet) {
        injectedStyleSheet.remove();
        injectedStyleSheet = null;
      }
    }
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

  useEffect(() => {
    try {
      const colorTypes = [
        "text",
        "background",
        "primary",
        "secondary",
        "accent",
      ];
      const prefixes = ["fg", "bg"];

      for (let i = 0; i < prefixes.length; i++) {
        const cssProperty = prefixes[i] == "fg" ? "color" : "background-color";
        for (let j = 0; j < colorTypes.length; j++) {
          for (let k = 0; k <= 95; k = k + 5) {
            let query = `.${prefixes[i]}-chroma-${colorTypes[j]}`,
              variableName = `--chroma-${colorTypes[j]}`;
            if (k > 0) {
              query += `-${k}`;
              variableName += `-${k}`;
            }
            const elements = document.querySelectorAll(query);
            elements.forEach((element) => {
              let inlineStyle = element.getAttribute("style") || "";
              inlineStyle = inlineStyle.replace(
                // /; color:\s*unset;\s*color:\s*var\(--chroma-primary\);?/g,
                new RegExp(
                  "; " +
                    cssProperty +
                    ":\\s*unset;\\s*" +
                    cssProperty +
                    ":\\s*var\\(" +
                    variableName +
                    "\\);?",
                  "g"
                ),
                ""
              );
              inlineStyle += `; ${cssProperty}: unset; ${cssProperty}: var(${variableName})`;
              element.setAttribute("style", inlineStyle);
            });
          }
        }
      }
    } catch (error) {
      console.error(
        "Error occurred while applying CSS variables declaration:",
        error
      );
    }
  }, []);
  // bg-chroma-primary-

  // useEffect(() => {
  //   try {
  //     // Declare CSS variables if they are not already initialized
  //     if (!document.documentElement.style.getPropertyValue("--chroma-text")) {
  //       document.documentElement.style.setProperty("--chroma-text", "#000");
  //     }
  //     if (
  //       !document.documentElement.style.getPropertyValue(
  //         "--chroma-background"
  //       )
  //     ) {
  //       document.documentElement.style.setProperty(
  //         "--chroma-background",
  //         "#FFF"
  //       );
  //     }
  //     if (
  //       !document.documentElement.style.getPropertyValue("--chroma-primary")
  //     ) {
  //       document.documentElement.style.setProperty(
  //         "--chroma-primary",
  //         "#007bff"
  //       );
  //     }
  //     if (
  //       !document.documentElement.style.getPropertyValue("--chroma-secondary")
  //     ) {
  //       document.documentElement.style.setProperty(
  //         "--chroma-secondary",
  //         "#6c757d"
  //       );
  //     }
  //     if (
  //       !document.documentElement.style.getPropertyValue("--chroma-accent")
  //     ) {
  //       document.documentElement.style.setProperty(
  //         "--chroma-accent",
  //         "#ffc107"
  //       );
  //     }

  //     // Apply CSS variables to specific elements based on class names
  //     const elementsToStyle = document.querySelectorAll(".bg-chroma-primary");
  //     elementsToStyle.forEach((element) => {
  //       element.style.setProperty(
  //         "background-color",
  //         "var(--chroma-primary)"
  //       );
  //     });

  //     // Rest of the code...
  //   } catch (error) {
  //     console.error("Error occurred in CSS variables declaration:", error);
  //   }
  // }, []);

  return (
    <>
      <Popup />
    </>
  );
}

export default App;
