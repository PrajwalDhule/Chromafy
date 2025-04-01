let contentScriptInjected = false;

chrome.action.onClicked.addListener((tab) => {
  if (!contentScriptInjected) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    await chrome.tabs.sendMessage(tabs[0].id, { type: "toggleReactApp" });
  });
});
