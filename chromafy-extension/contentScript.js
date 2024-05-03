console.log("from content script");

function injectReactApp(cssStyles) {
  if (document.getElementById("my-extension-script")) {
    return;
  }

  cssStyles.forEach((style) => {
    const existingStyle = document.querySelector(`head link#${style.id}`);
    if (!existingStyle) {
      const link = document.createElement("link");
      link.href = chrome.runtime.getURL(style.url);
      link.rel = "stylesheet";
      link.setAttribute("id", style.id);
      document.head.appendChild(link);
    }
  });

  const src = chrome.runtime.getURL(
    "chromafy-app/dist/assets/contentScript-CzBpnXvo.js"
  );
  const script = document.createElement("script");
  script.type = "module";
  script.src = `${src}?t=${Date.now()}`;
  script.id = "my-extension-script";
  script.onload = () => script.remove();
  document.body.appendChild(script);
}

function removeReactApp(cssStyles) {
  // option 1:
  // alert("Please close using the close button given")
  //  option 2:
  // const reactApp = document.getElementById("main-chromafy-app");
  // if (reactApp) {
  // const confirmation = confirm("Close chromafy extension?");
  // if (confirmation) {
  //   reactApp.remove();
  //   cssStyles.forEach((style) => {
  //     const existingStyle = document.querySelector(`head link#${style.id}`);
  //     if (existingStyle) {
  //       document.head.removeChild(existingStyle);
  //     }
  //   });
  // }
  // }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggleReactApp") {
    // css styles to be injected for chromafy ui and for the background website
    const cssStyles = [
      {
        url: "chromafy-app/src/index.css",
        id: "chromafy-self-css-style",
      },
      {
        url: "chromafy-app/src/inject.css",
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
