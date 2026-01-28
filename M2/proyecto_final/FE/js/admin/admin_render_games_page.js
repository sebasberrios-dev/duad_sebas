import { getAllGames, toogleGameStatus } from "../api/game_endpoints.js";
import { getAllUsers } from "../api/user_endpoints.js";
import {
  clearTable,
  showNoDataMessage,
  hideNoDataMessage,
  showErrorMessage,
  setActiveFilter,
  setupNavigation,
  checkAuthAndPermissions,
  getMapValue,
} from "./admin_utils.js";

// CONSTANTES
const FILTER_ALL = "all";
const FILTER_ACTIVE = "active";
const FILTER_FINISHED = "finished";

const GAME_STATUS = {
  ACTIVE: "active",
  FINISHED: "finished",
};

const STATUS_TEXT = {
  [GAME_STATUS.ACTIVE]: "Activa",
  [GAME_STATUS.FINISHED]: "Terminada",
  DEFAULT: "Desconocido",
};

const STATUS_CLASS = {
  [GAME_STATUS.ACTIVE]: "status-active",
  [GAME_STATUS.FINISHED]: "status-finished",
};

const BUTTON_TEXT = {
  [GAME_STATUS.ACTIVE]: "Terminar",
  [GAME_STATUS.FINISHED]: "Activar",
};

const BUTTON_CLASS = {
  [GAME_STATUS.ACTIVE]: "btn-toggle btn-finish",
  [GAME_STATUS.FINISHED]: "btn-toggle btn-activate",
};

const ERROR_LOAD_GAMES =
  "Error al cargar las partidas. Por favor, intenta nuevamente.";

// VARIABLES GLOBALES
let allGamesData = [];
let usersMap = {};
let currentFilter = FILTER_ALL;

// UTILIDADES PRIVADAS

// Obtener elementos DOM
function getElements() {
  return {
    tableSection: document.getElementById("table-section"),
    noGamesMessage: document.getElementById("no-games-message"),
    tbody: document.querySelector("#gamesTable tbody"),
    filterAll: document.getElementById("filter-all"),
    filterActive: document.getElementById("filter-active"),
    filterFinished: document.getElementById("filter-finished"),
    logoutBtn: document.getElementById("logoutBtn"),
    homeBtn: document.getElementById("homeBtn"),
    usersBtn: document.getElementById("usersBtn"),
  };
}

// Crear mapa de usuarios (id -> username)
function createUsersMap(users) {
  const map = {};
  users.forEach((user) => {
    map[user.id] = user.username;
  });
  return map;
}

// Obtener texto de estado
function getStatusText(status) {
  return getMapValue(STATUS_TEXT, status, STATUS_TEXT.DEFAULT);
}

// Determinar estado del juego
function getGameStatus(isActive) {
  return isActive ? GAME_STATUS.ACTIVE : GAME_STATUS.FINISHED;
}

// Obtener clase de estado
function getStatusClass(status) {
  return getMapValue(STATUS_CLASS, status);
}

// Obtener texto del botón
function getButtonText(status) {
  return getMapValue(BUTTON_TEXT, status);
}

// Obtener clase del botón
function getButtonClass(status) {
  return getMapValue(BUTTON_CLASS, status);
}

// Filtrar juegos según filtro activo
function filterGames(games, filter) {
  if (filter === FILTER_ACTIVE) {
    return games.filter((g) => g.is_active === true);
  } else if (filter === FILTER_FINISHED) {
    return games.filter((g) => g.is_active === false);
  }
  return games;
}

// FUNCIONES PRINCIPALES

// Crear fila de tabla para un juego
function createGameRow(game) {
  const template = document.getElementById("game-row-template");
  const row = template.content.cloneNode(true);
  const status = getGameStatus(game.is_active);

  // Llenar datos
  row.querySelector(".game-id").textContent = game.id;
  row.querySelector(".game-title").textContent = game.title;
  row.querySelector(".game-dm").textContent =
    usersMap[game.user_id] || "Desconocido";

  // Estado
  const statusSpan = row.querySelector(".game-status");
  statusSpan.textContent = getStatusText(status);
  statusSpan.className = `game-status ${getStatusClass(status)}`;

  // Botón
  const btn = row.querySelector(".btn-toggle");
  btn.textContent = getButtonText(status);
  btn.className = getButtonClass(status);
  btn.addEventListener("click", () => handleToggleStatus(game.id));

  return row;
}

// Manejar cambio de estado
async function handleToggleStatus(gameId) {
  try {
    await toogleGameStatus(gameId);
    // Recargar datos después del cambio
    await loadAllGames();
  } catch (error) {
    console.error("Error al cambiar el estado del juego:", error);
    alert("Error al cambiar el estado de la partida");
  }
}

// Renderizar tabla con juegos filtrados
function renderGamesTable(filter = FILTER_ALL) {
  const elements = getElements();
  const filteredGames = filterGames(allGamesData, filter);

  // Si no hay juegos después del filtro
  if (filteredGames.length === 0) {
    showNoDataMessage(elements.tableSection, elements.noGamesMessage);
    return;
  }

  // Mostrar tabla
  hideNoDataMessage(elements.tableSection, elements.noGamesMessage);
  clearTable(elements.tbody);

  // Crear filas
  filteredGames.forEach((game) => {
    const row = createGameRow(game);
    elements.tbody.appendChild(row);
  });
}

// Cargar todos los juegos y usuarios
async function loadAllGames() {
  const elements = getElements();

  try {
    const [games, users] = await Promise.all([getAllGames(), getAllUsers()]);

    allGamesData = games;
    usersMap = createUsersMap(users);

    renderGamesTable(currentFilter);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    showErrorMessage(elements.noGamesMessage, ERROR_LOAD_GAMES);
  }
}

// Configurar listeners de filtros
function setupFilterListeners() {
  const elements = getElements();
  const filterButtons = [
    elements.filterAll,
    elements.filterActive,
    elements.filterFinished,
  ];

  elements.filterAll.addEventListener("click", () => {
    currentFilter = FILTER_ALL;
    setActiveFilter("filter-all", filterButtons);
    renderGamesTable(currentFilter);
  });

  elements.filterActive.addEventListener("click", () => {
    currentFilter = FILTER_ACTIVE;
    setActiveFilter("filter-active", filterButtons);
    renderGamesTable(currentFilter);
  });

  elements.filterFinished.addEventListener("click", () => {
    currentFilter = FILTER_FINISHED;
    setActiveFilter("filter-finished", filterButtons);
    renderGamesTable(currentFilter);
  });
}

// Inicializar página
function initializePage() {
  if (!checkAuthAndPermissions()) {
    return;
  }

  const elements = getElements();
  loadAllGames();
  setupFilterListeners();
  setupNavigation(
    elements.logoutBtn,
    elements.homeBtn,
    elements.usersBtn,
    "users",
  );
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
