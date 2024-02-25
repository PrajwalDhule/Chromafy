document.addEventListener("DOMContentLoaded", function () {
  let popup = document.getElementById("popup");
  popup.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click event from bubbling up
  });
});
