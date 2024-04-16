const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";
let contentScriptInjected = false;

chrome.action.onClicked.addListener((tab) => {
  if (!contentScriptInjected) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    console.log("hello from query");
    await chrome.tabs.sendMessage(tabs[0].id, { type: "toggleReactApp" });
    console.log("Message sent successfully");
  });
});
