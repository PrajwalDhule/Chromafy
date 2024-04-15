import React, { useState, useEffect } from "react";

const ExportPopup = (props) => {
  const [codes, setCodes] = useState({});
  const [codeClasses, setCodeClasses] = useState("");
  const [format, setFormat] = useState("hex");
  const [shadesChecked, setShadesChecked] = useState(false);

  useEffect(() => {
    // console.log(props.palette);
    setVariables(props.palette);
  }, [props.palette]);

  useEffect(() => {
    try {
      let codeClasses = "";
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
            codeClasses += `${query}{\n\t${cssProperty}: var(${variableName});\n}\n`;
          }
        }
      }

      setCodeClasses(codeClasses);
    } catch (error) {
      console.error(
        "Error occurred while applying CSS styles to classes: ",
        error
      );
    }
  }, []);

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

  const handleToggleShades = () => {
    setShadesChecked(!shadesChecked);
  };

  function trimCode(text) {
    if (text) {
      const lines = text.split("\n");
      return (
        lines.slice(0, 6).join("\n") +
        "\n\n. . . .\n\n" +
        lines.slice(-7).join("\n")
      );
    }
  }

  function copyCssCode(textContent) {
    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        alert("Code copied!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  }

  function downloadCssFile(cssContent, fileName = "chroma_css_code.css") {
    const blob = new Blob([cssContent], { type: "text/css" });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("download", fileName);
    link.setAttribute("href", blobUrl);
    link.click();

    URL.revokeObjectURL(blobUrl);
  }

  return (
    <div id="export-popup" className="export-popup">
      {/* <ul className="languages-container container">
        <li className="selected option">CSS</li>
        <li className="option">SCSS</li>
        <li className="option">Tailwind CSS</li>
      </ul> */}
      <button
        id="close-btn"
        onClick={() => {
          document
            .getElementById("export-popup")
            .classList.remove("export-popup-open");
          document
            .getElementById("chromafy-wrapper")
            .classList.remove("chromafy-overlay-open");
        }}
      >
        &#x2716;
      </button>
      <div className="color-settings">
        <div className="color-types-container chromafy-export-container">
          <h4 className="title">Export CSS code</h4>
          <div
            className={`color-type ${format == "hex" ? "selected" : ""} option`}
            onClick={() => setFormat("hex")}
          >
            HEX
          </div>
          <div
            className={`color-type ${format == "rgb" ? "selected" : ""} option`}
            onClick={() => setFormat("rgb")}
          >
            RGB
          </div>
          <div
            className={`color-type ${format == "hsl" ? "selected" : ""} option`}
            onClick={() => setFormat("hsl")}
          >
            HSL
          </div>
        </div>
        <div className="color-filters-container chromafy-export-container">
          {/* <div className="">Themes</div> */}
          <label htmlFor="shades">Shades</label>
          <input
            type="checkbox"
            name="shades"
            id="shades"
            checked={shadesChecked}
            onChange={handleToggleShades}
          />

          {/* <div className="">Shades</div> */}
        </div>
      </div>
      <div className="code-container-wrapper">
        <div>
          <div className="code-block" id="code-variables">
            {/* <pre>{code}</pre> */}
            <pre>
              {codes &&
                codes[format] &&
                `${
                  codes[format].original +
                  (shadesChecked ? codes[format].shades : "")
                }`}
            </pre>
          </div>
          <div className="btn-wrapper">
            <button
              onClick={() => {
                const codeElement = document.getElementById("code-variables");
                const textContent = codeElement.textContent;
                copyCssCode(textContent);
              }}
            >
              Copy
            </button>
            <div className="download-btn-wrapper">
              <button
                onClick={() => {
                  const codeElement = document.getElementById("code-variables");
                  const textContent = codeElement.textContent;
                  const optionalFileName =
                    document.querySelector(
                      'input[type="text"]#css-code-file-name'
                    )?.value || "chromafy_css_code.css";
                  downloadCssFile(textContent, optionalFileName);
                }}
              >
                Download
              </button>
              <input
                type="text"
                placeholder="optional_custom_name.css"
                id="css-code-file-name"
              />
            </div>
          </div>
        </div>
        {codeClasses && (
          <div>
            <div className="code-block" id="code-classes">
              {/* <pre>{code2}</pre> */}
              <pre>{trimCode(codeClasses)}</pre>
            </div>
            <div className="btn-wrapper">
              <button
                onClick={() => {
                  copyCssCode(codeClasses);
                }}
              >
                Copy
              </button>
              <div className="download-btn-wrapper">
                <button
                  onClick={() => {
                    const optionalFileName =
                      document.querySelector(
                        'input[type="text"]#code-classes-file-name'
                      )?.value || "chromafy_code_classes.css";
                    downloadCssFile(codeClasses, optionalFileName);
                  }}
                >
                  Download
                </button>
                <input
                  type="text"
                  placeholder="optional_custom_name.css"
                  id="code-classes-file-name"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPopup;
