// import chroma from "chroma-js";
if (
  !window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--chroma-primary")
) {
  setPalette(0);
}

function adjustHue(val) {
  if (val < 0) val += Math.ceil(-val / 360) * 360;

  return val % 360;
}

function setPalette(colorSchemeId = -1) {
  const baseColor = {
    h: Math.random() * 360,
    s: Math.max(10, Math.round(Math.random() * 100)),
    l: Math.max(10, Math.round(Math.random() * 80)),
    mode: "hsl",
  };

  if (!(colorSchemeId <= 5 || colorSchemeId >= 0))
    colorSchemeId = Math.random() * 5;

  // const targetHueSteps = {
  //   analogous: [0, 30, 60],
  //   triadic: [0, 120, 240],
  //   tetradic: [0, 90, 180, 270],
  //   complementary: [0, 180],
  //   splitComplementary: [0, 150, 210],
  // };
  const targetHueSteps = [
    { hueSteps: [0, 0, 0], name: "monochromatic" },
    { hueSteps: [0, 30, 60], name: "analogous" },
    { hueSteps: [0, 120, 240], name: "triadic" },
    { hueSteps: [0, 90, 180, 270], name: "tetradic" },
    { hueSteps: [0, 180, 180], name: "complementary" },
    { hueSteps: [0, 150, 210], name: "splitComplementary" },
  ];

  const palettes = {};

  palettes.colors = targetHueSteps[colorSchemeId].hueSteps.map((step) => ({
    h: adjustHue(
      baseColor.h + step + (Math.round(Math.random() * 2) - 1) * (step / 10)
    ),
    s: Math.max(10, Math.round(Math.random() * 100)),
    l: Math.max(10, Math.round(Math.random() * 80)),
    mode: "hsl",
  }));

  const textColor = {
    h: adjustHue(palettes.colors[0].h + Math.round(Math.random() * 10) - 5),
    s: palettes.colors[0].s,
    l: Math.round(Math.random() * 4) + 1,
    mode: "hsl",
  };

  const bgColor = {
    h: adjustHue(palettes.colors[0].h + Math.round(Math.random() * 10) - 5),
    s: palettes.colors[0].s,
    l: 99 - Math.round(Math.random() * 4),
    mode: "hsl",
  };

  // for (const type of Object.keys(targetHueSteps)) {
  //   palettes[type] = targetHueSteps[type].map((step) => ({
  //     l: baseColor.l,
  //     c: baseColor.c,
  //     h: adjustHue(baseColor.h + step),
  //     mode: "lch",
  //   }));
  // }
  document.documentElement.style.setProperty(
    `--chroma-text`,
    getColor(textColor)
  );
  document.documentElement.style.setProperty(
    `--chroma-background`,
    getColor(bgColor)
  );
  document.documentElement.style.setProperty(
    `--chroma-primary`,
    getColor(palettes.colors[0])
  );
  document.documentElement.style.setProperty(
    `--chroma-secondary`,
    getColor(palettes.colors[1])
  );
  document.documentElement.style.setProperty(
    `--chroma-accent`,
    getColor(palettes.colors[2])
  );

  console.log(textColor, " ", bgColor);
  console.log(getColor(textColor), " ", getColor(bgColor));

  // return palettes;
}

function getColor(colorObject) {
  if (colorObject.mode === "lch") {
    // Access l, c, and h values
    const l = colorObject.l;
    const c = colorObject.c;
    const h = colorObject.h;

    // Convert lch values to RGB color

    const rgbColor = chroma.lch(l, c, h).css();
    const hslColor = chroma(rgbColor).hsl();

    return hslColor;
  } else if (colorObject.mode === "hsl") {
    return `hsl(${colorObject.h}, ${colorObject.s}%, ${colorObject.l}%)`;
  }
}

function generateRandomHex() {
  const randomNumber = Math.floor(Math.random() * 16777215);
  const hexValue = randomNumber.toString(16).padStart(6, "0");

  return "#" + hexValue;
}

const randomHex = generateRandomHex();
console.log(randomHex);

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("randomizeButton")
    .addEventListener("click", function () {
      //   const textValue = localStorage.getItem("text");
      setPalette(0);

      // const textValue = generateRandomHex();

      // // chrome.runtime.sendMessage({ action: "applyCSS", textValue });
      // const textElements = document.querySelectorAll(".prajwal-text");

      // // Iterate over each element
      // textElements.forEach((element) => {
      //   // Get the existing inline style
      //   let inlineStyle = element.getAttribute("style") || "";

      //   inlineStyle = inlineStyle.replace(
      //     /; color:\s*unset;\s*color:\s*#[0-9a-fA-F]{6};?/g,
      //     ""
      //   );
      //   inlineStyle += "; color: unset; color: " + textValue;

      //   // Set the updated inline style back to the element
      //   element.setAttribute("style", inlineStyle);
      // });
      // document.body.insertAdjacentHTML("beforeend", injectedHTML);
      // const removeButton = document.getElementById("removeButton");
      // if (removeButton) {
      //   removeButton.addEventListener("click", removeInjectedElement);
      // }
    });
});

// Create HTML element to be injected
// const injectedHTML = `
//   <div id="injectedElement" style="position: fixed; top: 20px; left: 20px; background-color: rgba(255, 0, 0, 0.5); padding: 10px;">
//     This is the injected element.
//     <button id="removeButton">Remove</button>
//   </div>
// `;

// Inject HTML into the background website
// document.body.insertAdjacentHTML('beforeend', injectedHTML);

// Function to remove the injected element
// function removeInjectedElement() {
//   const injectedElement = document.getElementById("injectedElement");
//   if (injectedElement) {
//     injectedElement.remove();
//   }
// }

// Add event listener to the remove button
