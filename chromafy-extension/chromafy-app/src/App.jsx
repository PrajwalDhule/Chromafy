import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Popup from "./components/Popup";

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

    function injectCSS() {
      injectedStyleSheet = document.createElement("style");
      document.head.appendChild(injectedStyleSheet);

      const styleSheet = injectedStyleSheet.sheet;
      const cssRule =
        ".bg-chroma-primary { background-color: var(--chroma-primary); }";
      styleSheet.insertRule(cssRule, styleSheet.cssRules.length);
    }

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

  return (
    <>
      <Popup />
    </>
  );
}

export default App;
