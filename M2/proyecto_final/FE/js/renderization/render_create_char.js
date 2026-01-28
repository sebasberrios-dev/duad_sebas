import { createChar } from "../logic/create_char.js";
import { isAuthenticated } from "../storage/auth.js";
import { setupNavigationListeners } from "../utils/renderization_utils.js";

// CONSTANTES
const LOGIN_URL = "/M2/proyecto_final/FE/html/login.html";
const INCOMPLETE_FIELDS_MESSAGE =
  "Por favor, complete todos los campos obligatorios.";

// UTILIDADES PRIVADAS

// Obtener datos del formulario de creación de personaje
function getCharacterFormData() {
  return {
    charName: document.getElementById("character-name").value.trim(),
    race: document.getElementById("race").value,
    className: document.getElementById("class").value,
    story: document.getElementById("character-story").value.trim(),
  };
}

// Validar datos del formulario
function validateCharacterData(charName, race, className, story) {
  if (!charName || !race || !className || !story) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }
  return true;
}

// Manejar envío del formulario de creación de personaje
async function handleCharacterFormSubmit(e) {
  e.preventDefault();

  const { charName, race, className, story } = getCharacterFormData();

  if (!validateCharacterData(charName, race, className, story)) {
    return;
  }

  await createChar(charName, race, className, story);
}

// Redirigir a la página de login
function redirectToLogin() {
  window.location.href = LOGIN_URL;
}

// Configurar formulario de creación de personaje
function setupCreateCharForm() {
  const createCharacterForm = document.getElementById("create-character-form");

  if (createCharacterForm) {
    createCharacterForm.addEventListener("submit", handleCharacterFormSubmit);
  }
}

// Inicializar página
function initializePage() {
  if (!isAuthenticated()) {
    redirectToLogin();
  } else {
    setupNavigationListeners();
    setupCreateCharForm();
  }
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
