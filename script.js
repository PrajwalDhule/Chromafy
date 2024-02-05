function generateRandomHex() {
  const randomNumber = Math.floor(Math.random() * 16777215);
  const hexValue = randomNumber.toString(16).padStart(6, "0");

  return "#" + hexValue;
}

const randomHex = generateRandomHex();
console.log(randomHex);

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("applyStyleButton")
    .addEventListener("click", function () {
      //   const textValue = localStorage.getItem("text");
      const textValue = generateRandomHex();

      chrome.runtime.sendMessage({ action: "applyCSS", textValue });
    });
});
