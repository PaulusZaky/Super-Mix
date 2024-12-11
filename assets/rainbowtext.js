window.addEventListener("load", function() {
  var elements = document.getElementsByClassName("rainbow-text");
  for (let i = 0; i < elements.length; i++) {
    generateRainbowText(elements[i]);
  }
});

function generateRainbowText(element) {
  var text = element.innerText;
  element.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    let charElem = document.createElement("span");
    charElem.style.color = "hsl(" + (300 * i / text.length) + ",90%,65%)";
    charElem.innerHTML = text[i];
    element.appendChild(charElem);
  }
}