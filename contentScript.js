console.log("from content script");

function injectReactApp(cssStyles) {
  if (document.getElementById("my-extension-script")) {
    return;
  }

  cssStyles.forEach((style) => {
    const existingStyle = document.querySelector(`head style#${style.id}`);
    if (!existingStyle) {
      const styleElement = document.createElement("style");

      styleElement.setAttribute("id", style.id);

      styleElement.textContent = style.textContent;

      document.head.appendChild(styleElement);
    }
  });

  const src = chrome.runtime.getURL(
    "chromafy-app/dist/assets/contentScript-Bh1uJaON.js"
  );
  const script = document.createElement("script");
  script.type = "module";
  script.src = `${src}?t=${Date.now()}`;
  script.id = "my-extension-script";
  script.onload = () => script.remove();
  document.body.appendChild(script);
}

function removeReactApp(cssStyles) {
  const reactApp = document.getElementById("main-chromafy-app");
  if (reactApp) {
    const confirmation = confirm("Close chromafy extension?");
    if (confirmation) {
      reactApp.remove();
      cssStyles.forEach((style) => {
        const existingStyle = document.querySelector(`head style#${style.id}`);
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
        console.log("existingStyle: ", existingStyle);
      });
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggleReactApp") {
    const cssStyles = [
      {
        textContent:
          '@import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Manrope:wght@200..800&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");',
        id: "chromafy-font-import-css-style",
      },
      {
        textContent: getInjectCssCode(),
        id: "chromafy-inject-css-style",
      },
    ];
    if (document.getElementById("main-chromafy-app")) {
      removeReactApp(cssStyles);
    } else {
      injectReactApp(cssStyles);
    }
  }
});

function getInjectCssCode() {
  const colors = ["text", "background", "primary", "secondary", "accent"];
  let styles = "";

  colors.forEach((color) => {
    styles += `
    .fg-chroma-${color} {
      color: var(--chroma-${color}) !important;
    }
    .bg-chroma-${color} {
      background-color: var(--chroma-${color}) !important;
    }
  `;

    for (let i = 1; i <= 19; i++) {
      styles += `
      .fg-chroma-${color}-${i * 5} {
        color: var(--chroma-${color}-${i * 5}) !important;
      }
      .bg-chroma-${color}-${i * 5} {
        background-color: var(--chroma-${color}-${i * 5}) !important;
      }
    `;
    }
  });

  return styles;
}
