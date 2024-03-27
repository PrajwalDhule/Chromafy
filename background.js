const extensions = "https://developer.chrome.com/docs/extensions";
const webstore = "https://developer.chrome.com/docs/webstore";
let contentScriptInjected = false;

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "applyCSS") {
//     const textValue = message.textValue;

//     // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     //   if (tabs.length > 0) {
//     //     const tabId = tabs[0].id;

//     //     chrome.scripting.insertCSS({
//     //       //   css: `:root { --text-color: "${textValue}"; }`,
//     //       css: `.prajwal-text { color: unset; color: ${textValue}; }`,
//     //       target: { tabId: tabId },
//     //     });
//     //   } else {
//     //     console.error("No active tab found.");
//     //   }
//     // });
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs.length > 0) {
//         const tabId = tabs[0].id;

//         chrome.scripting.executeScript({
//           target: { tabId: tabId },
//           function: function (textValue) {
//             // Get all elements with the class name "john-text"
//             const elements = document.querySelectorAll(".prajwal-text");

//             // Iterate over each element
//             elements.forEach((element) => {
//               // Get the existing inline style
//               let inlineStyle = element.getAttribute("style") || "";

//               inlineStyle = inlineStyle.replace(
//                 /; color:\s*unset;\s*color:\s*#[0-9a-fA-F]{6};?/g,
//                 ""
//               );
//               inlineStyle += "; color: unset; color: " + textValue;

//               // Set the updated inline style back to the element
//               element.setAttribute("style", inlineStyle);
//             });
//           },
//           args: [textValue],
//         });
//       } else {
//         console.error("No active tab found.");
//       }
//     });
//   }
// });

chrome.action.onClicked.addListener((tab) => {
  if (!contentScriptInjected) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
      // function: () => {
      //   console.log("hello 2");
      //   // Your content script logic here
      // },
    });
  }

  // Now, wait for the execution of executeScript() to finish
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    console.log("hello from query");
    await chrome.tabs.sendMessage(tabs[0].id, { type: "toggleReactApp" });
    console.log("Message sent successfully");
  });
});
