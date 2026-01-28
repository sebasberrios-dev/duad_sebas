import { getMyCharacters } from "../api/character_endpoints.js";
import { joinGame } from "../logic/join_game.js";
import { isAuthenticated } from "../storage/auth.js";
import { setupNavigationListeners } from "../utils/renderization_utils.js";

// CONSTANTES
const LOGIN_URL = "/M2/proyecto_final/FE/html/login.html";
const CREATE_CHARACTER_URL = "/M2/proyecto_final/FE/html/create_char.html";
const DEFAULT_SELECT_TEXT = "Selecciona un personaje";
const ERROR_LOAD_CHARACTERS =
  "Error al cargar tus personajes. Por favor, recarga la página.";
const ERROR_NO_CHARACTERS =
  "Debes crear al menos un personaje para unirte a una partida.";
const ERROR_NO_LINK = "Por favor, ingresa el link de invitación.";
const ERROR_NO_CHARACTER = "Por favor, selecciona un personaje.";

// UTILIDADES PRIVADAS

// Obtener elemento select de personajes
function getCharacterSelect() {
  return document.getElementById("character-select");
}

// Crear opción de personaje para el select
function createCharacterOption(character) {
  const option = document.createElement("option");
  option.value = character.id;
  option.textContent = `${character.name} - ${character.class} (Nivel ${character.level})`;
  return option;
}

// Limpiar y configurar select de personajes
function resetCharacterSelect(selectElement) {
  selectElement.innerHTML = `<option value="" disabled selected>${DEFAULT_SELECT_TEXT}</option>`;
}

// Poblar select con personajes
function populateCharacterSelect(selectElement, characters) {
  characters.forEach((character) => {
    const option = createCharacterOption(character);
    selectElement.appendChild(option);
  });
}

// Obtener datos del formulario
function getJoinGameFormData() {
  const characterSelect = getCharacterSelect();
  return {
    invitationLink: document.getElementById("game-link").value.trim(),
    characterId: characterSelect.value,
  };
}

// Validar datos del formulario
function validateJoinGameData(invitationLink, characterId) {
  if (!invitationLink) {
    alert(ERROR_NO_LINK);
    return false;
  }

  if (!characterId) {
    alert(ERROR_NO_CHARACTER);
    return false;
  }

  return true;
}

// Manejar envío del formulario
async function handleJoinGameSubmit(e) {
  e.preventDefault();

  const { invitationLink, characterId } = getJoinGameFormData();

  console.log(
    "Formulario enviado - Link:",
    invitationLink,
    "Character ID:",
    characterId,
  );

  if (!validateJoinGameData(invitationLink, characterId)) {
    return;
  }

  await joinGame(invitationLink, characterId);
}

// Redirigir a login
function redirectToLogin() {
  window.location.href = LOGIN_URL;
}

// FUNCIONES PRINCIPALES

// Cargar personajes del usuario
async function loadUserCharacters() {
  try {
    console.log("Cargando personajes del usuario...");
    const characters = await getMyCharacters();
    console.log("Personajes obtenidos:", characters);

    // Verificar si no hay personajes
    if (!characters || characters.length === 0) {
      alert(ERROR_NO_CHARACTERS);
      window.location.href = CREATE_CHARACTER_URL;
      return;
    }

    const characterSelect = getCharacterSelect();
    resetCharacterSelect(characterSelect);
    populateCharacterSelect(characterSelect, characters);

    console.log(`${characters.length} personajes cargados en el selector`);
  } catch (error) {
    console.error("Error al cargar personajes:", error);
    alert(ERROR_LOAD_CHARACTERS);
  }
}

// Configurar formulario de unirse al juego
function setupJoinGameForm() {
  const joinGameForm = document.getElementById("join-game-form");

  if (joinGameForm) {
    joinGameForm.addEventListener("submit", handleJoinGameSubmit);
  } else {
    console.error("No se encontró el formulario join-game-form");
  }
}

// Inicializar página
function initializePage() {
  console.log("Página join_game.html cargada");

  if (!isAuthenticated()) {
    console.log("Usuario no autenticado, redirigiendo...");
    redirectToLogin();
  } else {
    console.log("Usuario autenticado, inicializando página...");
    setupNavigationListeners();
    setupJoinGameForm();
    loadUserCharacters();
  }
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
