import { createGame } from "../api/game_endpoints.js";
import { createParticipationToOwner } from "../api/part_endpoints.js";

// CONSTANTES
const MY_GAMES_URL = "/M2/proyecto_final/FE/html/my_games.html";
const UNIQUE_ID_RANDOM_LENGTH = 9;
const SUCCESS_MESSAGE_TEMPLATE =
  "Juego creado exitosamente. Código de invitación: ";
const ERROR_MESSAGE = "Error al crear el juego. Por favor, inténtalo de nuevo.";

// UTILIDADES PRIVADAS

// Generar ID único para el juego
function generateUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, UNIQUE_ID_RANDOM_LENGTH)}`;
}

// Construir objeto de datos del juego
function buildGameData(gameTitle, description, uniqueId) {
  return {
    title: gameTitle,
    description: description,
    link: uniqueId,
  };
}

// Formatear mensaje de éxito
function formatSuccessMessage(uniqueId) {
  return `${SUCCESS_MESSAGE_TEMPLATE}${uniqueId}`;
}

// Redirigir a la página de mis juegos
function redirectToMyGames() {
  window.location.href = MY_GAMES_URL;
}

// Crear participación para el creador del juego
async function createPartForCreator(gameId) {
  try {
    const participationData = {
      game_id: gameId,
    };
    const response = await createParticipationToOwner(participationData);

    if (response) {
      console.log("Participation for game owner created successfully.");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error creating participation for game owner:", error);
    throw error;
  }
}

// FUNCIONES PÚBLICAS

// Crear un nuevo juego
export const createGameFunc = async (gameTitle, description) => {
  try {
    console.log("Creating game...");
    const uniqueId = generateUniqueId();
    const gameData = buildGameData(gameTitle, description, uniqueId);

    const response = await createGame(gameData);

    if (response) {
      console.log("Game created successfully. DEBUG:", response);
      alert(formatSuccessMessage(uniqueId));

      if (await createPartForCreator(response.game_id)) {
        console.log("Creator participation created.");
        redirectToMyGames();
      } else {
        throw new Error("Failed to create participation for game creator.");
      }
    }
  } catch (error) {
    console.error("Error creating game:", error);
    alert(ERROR_MESSAGE);
  }
};
