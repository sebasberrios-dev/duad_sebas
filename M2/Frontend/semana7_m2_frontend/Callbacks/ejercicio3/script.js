const button = document.getElementById("button");
const text = document.getElementById("text");

const colors = [
  "text-red",
  "text-blue",
  "text-green",
  "text-yellow",
  "text-cyan",
  "text-pink",
];

const randomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

function changeColor(callbackFunction) {
  text.className = `text ${callbackFunction()}`;
}

button.addEventListener("click", () => changeColor(randomColor));
