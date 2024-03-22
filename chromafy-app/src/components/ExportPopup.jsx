import React, { useState, useEffect } from "react";

const ExportPopup = (props) => {
  const [codes, setCodes] = useState({});

  useEffect(() => {
    // console.log(props.palette);
    setVariables(props.palette);
  }, [props.palette]);

  function copyCode(codeElement) {
    const codeText = codeElement.textContent;

    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        alert("Code copied!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  }

  function setVariables(palette) {
    let cssCodes = {
      hex: {
        original: "",
        shades: "",
      },
      rgb: {
        original: "",
        shades: "",
      },
      hsl: {
        original: "",
        shades: "",
      },
    };

    const colorTypes = ["text", "background", "primary", "secondary", "accent"];

    if (palette) {
      for (let i = 0; i < colorTypes.length; i++) {
        let hsl = getColor(palette[i]);
        let conversions = hslToRgb(hsl);
        if (conversions != null) {
          let { rgb, hex } = conversions;
          cssCodes.hsl.original += `--chroma-${colorTypes[i]}: ${hsl};\n`;
          cssCodes.rgb.original += `--chroma-${colorTypes[i]}: ${rgb};\n`;
          cssCodes.hex.original += `--chroma-${colorTypes[i]}: ${hex};\n`;

          cssCodes.hsl.shades += "\n";
          cssCodes.rgb.shades += "\n";
          cssCodes.hex.shades += "\n";

          for (let j = 5; j <= 95; j = j + 5) {
            let hslShade = getColor(palette[i], j / 100);
            let { rgb: rgbShade, hex: hexShade } = hslToRgb(hslShade);
            cssCodes.hsl.shades += `--chroma-${colorTypes[i]}-${j}: ${hslShade};\n`;
            cssCodes.rgb.shades += `--chroma-${colorTypes[i]}-${j}: ${rgbShade};\n`;
            cssCodes.hex.shades += `--chroma-${colorTypes[i]}-${j}: ${hexShade};\n`;
          }
        } else {
          console.log("error converting to rgb and hex");
        }
      }
    } else {
      console.log("error getting color palette");
    }

    setCodes({ ...cssCodes });
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

  function hslToRgb(hslString) {
    // Parse the HSL(A) string
    const match = hslString.match(
      /hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,?\s*([\d.]+)?\)/
    );
    if (!match) return null;

    const h = parseInt(match[1]) / 360;
    const s = parseInt(match[2]) / 100;
    const l = parseInt(match[3]) / 100;
    const a = match[4] ? parseFloat(match[4]) : 1;

    // Convert HSL(A) to RGB(A)
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const rgbString = `rgba(${Math.round(r * 255)}, ${Math.round(
      g * 255
    )}, ${Math.round(b * 255)}, ${a})`;

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const hexString =
      `#${toHex(r)}${toHex(g)}${toHex(b)}` +
      (a < 1
        ? Math.round(a * 255)
            .toString(16)
            .padStart(2, "0")
        : "");

    return { rgb: rgbString, hex: hexString };
  }

  // Example usage:
  // const hslString = "hsla(120, 100%, 50%, 0.5)";
  // const result = hslToRgb(hslString);
  // console.log(result);

  const code =
    "--chroma-text: hsl(166, 68%, 6%);\n--chroma-background-50: hsl(171, 68%, 96%, 0.9);\n--chroma-primary: hsl(168, 67%, 55%);\n--chroma-secondary: hsl(341, 67%, 71%);\n--chroma-accent: hsl(38,67%, 60%);";

  const code2 =
    ".fg-chroma-text {\n\tcolor: var(--chroma-text) !important;\n}\n. . . . . .\n.bg-chroma-accent-95 {\n\tcolor: var(--chroma-accent-95) !important;\n}";

  return (
    <div className="export-popup">
      {/* <ul className="languages-container container">
        <li className="selected option">CSS</li>
        <li className="option">SCSS</li>
        <li className="option">Tailwind CSS</li>
      </ul> */}
      <div className="color-settings">
        <div className="color-types-container container">
          <h4 className="title">Import CSS code</h4>
          <div className="color-type selected option">HEX</div>
          <div className="color-type option">RGB</div>
          <div className="color-type option">HSL</div>
        </div>
        <div className="color-filters-container container">
          {/* <div className="">Themes</div> */}
          <div className="">Checkbox here</div>
          <div className="">Shades</div>
        </div>
      </div>
      <div className="code-container-wrapper">
        <div>
          <div className="btn-wrapper">
            <button
              onClick={() => {
                const codeElement = document.getElementById("code-variables");
                copyCode(codeElement);
              }}
            >
              Copy
            </button>
            <button>Download</button>
          </div>
          <div className="code-block" id="code-variables">
            {/* <pre>{code}</pre> */}
            <pre>
              {codes && codes.hex && `${codes.hex.original + codes.hex.shades}`}
            </pre>
          </div>
        </div>
        <div>
          <div className="btn-wrapper">
            <button
              onClick={() => {
                const codeElement = document.getElementById("code-classes");
                copyCode(codeElement);
              }}
            >
              Copy
            </button>
            <button>Download</button>
          </div>
          <div className="code-block" id="code-classes">
            <pre>{code2}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPopup;
