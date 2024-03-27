console.log("from content script");

function injectReactApp() {
  // (async () => {
  //   const src = chrome.runtime.getURL(
  //     "chromafy-app/dist/assets/contentScript-ogjL2rC5.js"
  //   );
  //   await import(src);
  // })();
  // console.log(chrome.runtime.getURL("chromafy-app/dist/index.html"));
  if (document.getElementById("my-extension-script")) {
    return;
  }

  const src = chrome.runtime.getURL(
    "chromafy-app/dist/assets/contentScript-B4j3DhmZ.js"
  );
  const script = document.createElement("script");
  script.type = "module";
  script.src = `${src}?t=${Date.now()}`; // Add a unique query parameter
  script.id = "my-extension-script";
  script.onload = () => script.remove(); // Optional: remove the script tag once the script is loaded
  document.body.appendChild(script);
}

// Function to remove React app from the background website's DOM
function removeReactApp() {
  // Find and remove the injected HTML content
  const reactApp = document.getElementById("main-chromafy-app");
  if (reactApp) {
    const confirmation = confirm("Close chromafy extension?");
    if (confirmation) reactApp.remove();
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from the background script
  if (message.type === "toggleReactApp") {
    // Toggle the presence of the injected React app
    if (document.getElementById("main-chromafy-app")) {
      console.log("bye");
      removeReactApp();
    } else {
      console.log("hello");
      injectReactApp();
    }
  }
});

// fetch("build/index.html")
//   .then((response) => response.text())
//   .then((html) => {
//     // Inject the HTML content into the background website's DOM
//     let container = document.getElementById("container");
//     container.innerHTML = html;
//     let container2 = document.getElementById("container");
//     console.log(container2);
//     document.body.insertAdjacentHTML("beforeend", html);
//   })
//   .catch((error) => console.error("Error fetching index.html:", error));
