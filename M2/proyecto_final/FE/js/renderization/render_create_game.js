import { createGameFunc } from "../logic/create_game.js";
import { isAuthenticated } from "../storage/auth.js";
import { setupNavigationListeners } from "../utils/renderization_utils.js";

// CONSTANTES
const LOGIN_URL = "/M2/proyecto_final/FE/html/login.html";
const INCOMPLETE_FIELDS_MESSAGE =
  "Por favor, complete todos los campos obligatorios.";

// UTILIDADES PRIVADAS

// Obtener datos del formulario de creación de juego
function getGameFormData() {
  return {
    gameTitle: document.getElementById("game-name").value.trim(),
    description: document.getElementById("game-description").value.trim(),
  };
}

// Validar datos del formulario
function validateGameData(gameTitle, description) {
  if (!gameTitle || !description) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }
  return true;
}

// Manejar envío del formulario de creación de juego
async function handleGameFormSubmit(e) {
  e.preventDefault();

  const { gameTitle, description } = getGameFormData();

  if (!validateGameData(gameTitle, description)) {
    return;
  }

  await createGameFunc(gameTitle, description);
}

// Redirigir a la página de login
function redirectToLogin() {
  window.location.href = LOGIN_URL;
}

// Configurar formulario de creación de juego
function setupCreateGameForm() {
  const createGameForm = document.getElementById("create-game-form");

  if (createGameForm) {
    createGameForm.addEventListener("submit", handleGameFormSubmit);
  }
}

// Inicializar página
function initializePage() {
  if (!isAuthenticated()) {
    redirectToLogin();
  } else {
    setupNavigationListeners();
    setupCreateGameForm();
  }
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
