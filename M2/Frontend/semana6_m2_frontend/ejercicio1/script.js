const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const list = document.getElementById("list");

const addItem = () => {
  const newItem = document.createElement("li"); // Crea un nuevo elemento li
  newItem.innerHTML = "New Item"; // Asigna contenido al li
  list.appendChild(newItem); // Agrega el li a la lista ol
};

addButton.addEventListener("click", addItem);

const removeAllItems = () => {
  const items = list.querySelectorAll("li"); // Selecciona todos los elementos li dentro de la lista
  items.forEach((item) => item.remove()); // Remueve cada elemento li
};

removeButton.addEventListener("click", removeAllItems);
