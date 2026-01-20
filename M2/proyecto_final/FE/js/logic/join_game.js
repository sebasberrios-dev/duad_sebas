import { getGameByLink } from "../api/game_endpoints.js";
import { createParticipation } from "../api/part_endpoints.js";

// CONSTANTES
const GAME_PAGE_URL = "/M2/proyecto_final/FE/html/game.html";
const SUCCESS_MESSAGE_TEMPLATE = "Has ingresado al juego: ";
const ALREADY_PARTICIPATING_MESSAGE =
  "Ya estás participando en este juego con este personaje.";
const ERROR_MESSAGE =
  "Error al unirse al juego. Por favor, verifica el link de invitación e inténtalo de nuevo.";
const ALREADY_PARTICIPATING_ERROR_KEY = "ya está participando";

// UTILIDADES PRIVADAS

// Construir objeto de participación
function buildParticipationData(gameId, characterId) {
  return {
    game_id: gameId,
    character_id: characterId,
  };
}

// Formatear mensaje de éxito
function formatSuccessMessage(gameTitle) {
  return `${SUCCESS_MESSAGE_TEMPLATE}${gameTitle}`;
}

// Construir URL de redirección al juego
function buildGameUrl(inviteLink) {
  return `${GAME_PAGE_URL}?invite=${inviteLink}`;
}

// Redirigir a la página del juego
function redirectToGame(inviteLink) {
  window.location.href = buildGameUrl(inviteLink);
}

// Verificar si el error es por participación duplicada
function isAlreadyParticipatingError(error) {
  return error.message.includes(ALREADY_PARTICIPATING_ERROR_KEY);
}

// Mostrar mensaje de error apropiado
function showErrorMessage(error) {
  if (isAlreadyParticipatingError(error)) {
    alert(ALREADY_PARTICIPATING_MESSAGE);
  } else {
    alert(ERROR_MESSAGE);
  }
}

// FUNCIONES PÚBLICAS

// Unirse a un juego mediante link de invitación
export const joinGame = async (inviteLink, characterId) => {
  try {
    console.log("Joining game...");

    // Obtener información del juego
    const gameData = await getGameByLink(inviteLink);

    if (gameData) {
      // Crear la participación
      const participationData = buildParticipationData(
        gameData.id,
        characterId,
      );
      await createParticipation(participationData);

      console.log("Joined game successfully.");
      alert(formatSuccessMessage(gameData.title));
      redirectToGame(inviteLink);
    }
  } catch (error) {
    console.error("Error joining game:", error);
    showErrorMessage(error);
  }
};
