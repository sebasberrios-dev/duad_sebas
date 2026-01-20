import { getMyGames } from "../api/game_endpoints.js";
import { getUserParticipations } from "../api/part_endpoints.js";
import { getGameById } from "../api/game_endpoints.js";
import { getAuthUser } from "../storage/auth.js";
import { myGamesNavListeners } from "../utils/renderization_utils.js";

// CONSTANTES
const GAME_PAGE_URL = "/M2/proyecto_final/FE/html/game.html";
const CREATE_GAME_URL = "create_game.html";

const USER_ROLES = {
  PLAYER: "player",
  DM: "dm",
};

const GAME_STATUS = {
  ACTIVE: "active",
  FINISHED: "finished",
};

const STATUS_TEXT = {
  [GAME_STATUS.ACTIVE]: "🟢 Activa",
  [GAME_STATUS.FINISHED]: "⚫ Terminada",
  DEFAULT: "⚪ Desconocido",
};

const DEFAULT_DESCRIPTION = "Sin descripción disponible";
const ERROR_NO_USER_ROLE = "No se pudo obtener el rol del usuario";
const ERROR_LOAD_GAMES =
  "Error al cargar las partidas. Por favor, intenta nuevamente.";

const DISPLAY_VISIBLE = "block";
const DISPLAY_HIDDEN = "none";

// UTILIDADES PRIVADAS

// Obtener elementos DOM de secciones
function getSectionElements() {
  return {
    playerSection: document.getElementById("player-section"),
    dmSection: document.getElementById("dm-section"),
    noGamesMessage: document.getElementById("no-games-message"),
    playerGamesGrid: document.getElementById("player-games-grid"),
    dmGamesGrid: document.getElementById("dm-games-grid"),
  };
}

// Obtener texto de estado del juego
function getStatusText(status) {
  return STATUS_TEXT[status] || STATUS_TEXT.DEFAULT;
}

// Determinar estado del juego
function getGameStatus(isActive) {
  return isActive ? GAME_STATUS.ACTIVE : GAME_STATUS.FINISHED;
}

// Construir URL del juego
function buildGameUrl(inviteLink) {
  return `${GAME_PAGE_URL}?invite=${inviteLink}`;
}

// Construir URL completa del juego
function buildFullGameUrl(inviteLink) {
  return `${window.location.origin}${buildGameUrl(inviteLink)}`;
}

// Cargar juegos según el rol del usuario
async function loadGamesByRole(userRole) {
  if (userRole === USER_ROLES.PLAYER) {
    const participations = await getUserParticipations();
    console.log("Participaciones obtenidas:", participations);
    return await Promise.all(
      participations.map((part) => getGameById(part.game_id)),
    );
  } else if (userRole === USER_ROLES.DM) {
    return await getMyGames();
  }
  return [];
}

// Configurar tarjeta de juego con datos comunes
function setupGameCard(card, game, gameUrl) {
  const gameCard = card.querySelector(".game-card");
  const status = getGameStatus(game.is_active);

  gameCard.querySelector(".game-title").textContent = game.title;
  gameCard.querySelector(".game-status").textContent = getStatusText(status);
  gameCard.querySelector(".game-status").className =
    `game-status status-${status}`;
  gameCard.querySelector(".game-description").textContent =
    game.description || DEFAULT_DESCRIPTION;

  const link = gameCard.querySelector(".game-link");
  link.textContent = `Código de invitación: ${game.link}`;
  link.href = gameUrl;

  const button = gameCard.querySelector(".btn-primary");
  button.addEventListener("click", () => {
    window.location.href = gameUrl;
  });
}

// Mostrar mensaje de error
function showErrorMessage(elements) {
  elements.noGamesMessage.style.display = DISPLAY_VISIBLE;
  elements.noGamesMessage.innerHTML = `
    <p style="font-size: 1.3rem; color: rgba(255, 100, 100, 0.9)">
      ${ERROR_LOAD_GAMES}
    </p>
  `;
}

// Mostrar mensaje de sin juegos
function showNoGamesMessage(elements) {
  elements.noGamesMessage.style.display = DISPLAY_VISIBLE;
  elements.playerSection.style.display = DISPLAY_HIDDEN;
  elements.dmSection.style.display = DISPLAY_HIDDEN;
}

// Ocultar mensaje de sin juegos
function hideNoGamesMessage(elements) {
  elements.noGamesMessage.style.display = DISPLAY_HIDDEN;
}

// Limpiar grid de juegos
function clearGamesGrid(grid) {
  if (grid) {
    grid.innerHTML = "";
  }
}

// Renderizar juegos del jugador
function renderPlayerGames(gamesData, elements) {
  elements.playerSection.style.display = DISPLAY_VISIBLE;
  elements.dmSection.style.display = DISPLAY_HIDDEN;
  clearGamesGrid(elements.playerGamesGrid);

  gamesData.forEach((game) => {
    const card = createPlayerGameCard(game);
    elements.playerGamesGrid.appendChild(card);
  });
}

// Renderizar juegos del DM
function renderDMGames(gamesData, elements) {
  elements.playerSection.style.display = DISPLAY_HIDDEN;
  elements.dmSection.style.display = DISPLAY_VISIBLE;
  clearGamesGrid(elements.dmGamesGrid);

  // Agregar tarjeta de crear nueva partida al inicio
  const createCard = createNewGameCard();
  elements.dmGamesGrid.appendChild(createCard);

  gamesData.forEach((game) => {
    const card = createDMGameCard(game);
    elements.dmGamesGrid.appendChild(card);
  });
}

// FUNCIONES PRINCIPALES

// Crear tarjeta de partida como jugador
function createPlayerGameCard(game) {
  const template = document.getElementById("player-card-template");
  const card = template.content.cloneNode(true);
  const gameUrl = buildFullGameUrl(game.link);

  setupGameCard(card, game, gameUrl);
  return card;
}

// Crear tarjeta de partida como DM
function createDMGameCard(game) {
  const template = document.getElementById("dm-card-template");
  const card = template.content.cloneNode(true);
  const gameUrl = buildGameUrl(game.link);

  setupGameCard(card, game, gameUrl);
  return card;
}

// Crear tarjeta de nueva partida
function createNewGameCard() {
  const template = document.getElementById("create-card-template");
  const card = template.content.cloneNode(true);

  const button = card.querySelector(".btn-create");
  button.addEventListener("click", () => {
    window.location.href = CREATE_GAME_URL;
  });

  return card;
}

// Renderizar las partidas del usuario
async function renderMyGames() {
  try {
    const user = getAuthUser();
    console.log("Usuario autenticado:", user);

    if (!user || !user.role) {
      throw new Error(ERROR_NO_USER_ROLE);
    }

    const userRole = user.role;
    const gamesData = await loadGamesByRole(userRole);

    console.log("Juegos obtenidos:", gamesData);

    const elements = getSectionElements();

    // Si no hay partidas, mostrar mensaje
    if (!gamesData || gamesData.length === 0) {
      showNoGamesMessage(elements);
      return;
    }

    // Renderizar según el rol del usuario
    if (userRole === USER_ROLES.PLAYER) {
      renderPlayerGames(gamesData, elements);
    } else if (userRole === USER_ROLES.DM) {
      renderDMGames(gamesData, elements);
    }

    hideNoGamesMessage(elements);
  } catch (error) {
    console.error("Error al cargar las partidas:", error);
    const elements = getSectionElements();
    showErrorMessage(elements);
  }
}

// Inicializar página
function initializePage() {
  renderMyGames();
  myGamesNavListeners();
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
