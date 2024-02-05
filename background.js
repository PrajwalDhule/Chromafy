const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "applyCSS") {
    const textValue = message.textValue;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;

        chrome.scripting.insertCSS({
          //   css: `:root { --text-color: "${textValue}"; }`,
          css: `.prajwal-text { color: ${textValue}; }`,
          target: { tabId: tabId },
        });
      } else {
        console.error("No active tab found.");
      }
    });
  }
});
