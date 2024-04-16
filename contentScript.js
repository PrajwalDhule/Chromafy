console.log("from content script");

function injectReactApp() {
  if (document.getElementById("my-extension-script")) {
    return;
  }

  const existingStyle = document.querySelector(
    'head style[data-chromafy-font-import-injected="true"]'
  );
  if (!existingStyle) {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("data-chromafy-font-import-injected", "true");

    styleElement.textContent =
      '@import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Manrope:wght@200..800&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");';

    document.head.appendChild(styleElement);
  }

  const src = chrome.runtime.getURL(
    "chromafy-app/dist/assets/contentScript-CTWoDaeL.js"
  );
  const script = document.createElement("script");
  script.type = "module";
  script.src = `${src}?t=${Date.now()}`;
  script.id = "my-extension-script";
  script.onload = () => script.remove();
  document.body.appendChild(script);
}

function removeReactApp() {
  const reactApp = document.getElementById("main-chromafy-app");
  if (reactApp) {
    const confirmation = confirm("Close chromafy extension?");
    if (confirmation) reactApp.remove();
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggleReactApp") {
    if (document.getElementById("main-chromafy-app")) {
      console.log("bye");
      removeReactApp();
    } else {
      console.log("hello");
      injectReactApp();
    }
  }
});
