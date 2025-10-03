const input = document.getElementById("input");
const button = document.querySelector(".add-button");
const name = document.getElementById("name");

function handleButtonClick() {
  const inputValue = input.value; // Obtiene el valor del input
  name.textContent = inputValue; // Muestra ese valor en el p
  input.value = ""; // Limpia el input
}

button.addEventListener("click", handleButtonClick);
