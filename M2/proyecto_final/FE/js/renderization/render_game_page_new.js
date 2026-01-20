// GESTOR PRINCIPAL DE PARTIDA
// Orquesta todos los módulos de la partida
import { gameState } from "../game/game_state.js";
import { getAuthUser, clearAuthUser } from "../storage/auth.js";
import { getGameParticipants } from "../api/part_endpoints.js";
import { getCharacterById } from "../api/character_endpoints.js";
import { getGameByLink } from "../api/game_endpoints.js";
import { updateXPBar } from "../logic/xp_system.js";

// Handlers
import {
  switchNoteTab,
  addDMNote,
  addPlayerNote,
  loadNotes,
} from "../game/notes_handler.js";
import { sendNarrative, loadNarrative } from "../game/narrative_handler.js";
import {
  playerRollDecision,
  dmRollDifficulty,
  playerAttack,
  assignCombat,
} from "../game/actions_handler.js";
import { sendChatMessage, loadChatMessages } from "../game/chat_handler.js";
import { setupNpcModal } from "../game/npc_handler.js";
import { setupShopListeners } from "../game/shop_handler.js";
import { loadAndRenderInventory } from "../game/inventory_handler.js";

// CONSTANTES
const LOGIN_URL = "/M2/proyecto_final/FE/html/login.html";
const MY_GAMES_URL = "/M2/proyecto_final/FE/html/my_games.html";
const NARRATIVE_UPDATE_INTERVAL = 4000; // 4 segundos
const GAME_STATUS_CHECK_INTERVAL = 5000; // 5 segundos
const NAVBAR_MY_GAMES_INDEX = 1;
const NAVBAR_LOGOUT_INDEX = 2;

const ERROR_MESSAGES = {
  NO_INVITE: "No se especificó enlace de invitación",
  GAME_NOT_AVAILABLE: "Esta partida no está disponible o ha terminado.",
  INIT_ERROR: "Error al cargar la partida",
  GAME_ENDED: "La partida ha terminado. Serás redirigido a tus partidas.",
};

// UTILIDADES PRIVADAS

// Obtener código de invitación desde la URL
function getInviteCodeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("invite");
}

// Redirigir a login
function redirectToLogin() {
  window.location.href = LOGIN_URL;
}

// Redirigir a mis juegos
function redirectToMyGames() {
  window.location.href = MY_GAMES_URL;
}

// Verificar autenticación del usuario
function checkUserAuth() {
  const user = getAuthUser();
  if (!user) {
    redirectToLogin();
    return null;
  }
  return user.user_id || user.id;
}

// Cargar datos del personaje del jugador
async function loadPlayerCharacter(characterId) {
  try {
    const character = await getCharacterById(characterId);
    if (character) {
      updateXPBar(character.xp, character.level);
    }
  } catch (error) {
    console.error("Error al cargar personaje:", error);
  }
}

// Obtener elemento DOM de sección
function getSectionElement(sectionId) {
  return document.getElementById(sectionId);
}

// Mostrar u ocultar sección
function toggleSection(sectionId, show) {
  const section = getSectionElement(sectionId);
  if (section) {
    section.style.display = show ? "block" : "none";
  }
}

// Configurar UI para DM
function setupDMUI() {
  toggleSection("dm-notes-section", true);
  toggleSection("dm-actions", true);
  toggleSection("player-notes-section", false);
  toggleSection("player-actions", false);
  toggleSection("inventory-section", false);
}

// Configurar UI para Jugador
function setupPlayerUI() {
  toggleSection("player-notes-section", true);
  toggleSection("player-actions", true);
  toggleSection("inventory-section", true);
  toggleSection("dm-notes-section", false);
  toggleSection("dm-actions", false);
}

// Configurar listener de notas
function setupNotesListeners() {
  const noteTabs = document.querySelectorAll(".note-tab");
  noteTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      switchNoteTab(tab.dataset.tab);
    });
  });

  const btnAddDMNote = document.querySelector(
    "#dm-notes-section .btn-add-note",
  );
  btnAddDMNote?.addEventListener("click", addDMNote);

  const btnAddPlayerNote = document.querySelector(
    "#player-notes-section .btn-add-note",
  );
  btnAddPlayerNote?.addEventListener("click", addPlayerNote);
}

// Configurar listeners de chat
function setupChatListeners() {
  const chatInput = document.querySelector(".chat-input");
  const btnSend = document.querySelector(".btn-send");

  btnSend?.addEventListener("click", sendChatMessage);
  chatInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage();
  });
}

// Configurar listeners de acciones del jugador
function setupPlayerActionsListeners() {
  const btnRollDecision = document.querySelector("#player-actions .btn-action");
  btnRollDecision?.addEventListener("click", playerRollDecision);

  const btnAttack = document.querySelector(".btn-attack");
  btnAttack?.addEventListener("click", playerAttack);

  setupShopListeners();
}

// Configurar listeners de acciones del DM
function setupDMActionsListeners() {
  const btnNarrate = document.querySelector(".btn-narrate");
  btnNarrate?.addEventListener("click", sendNarrative);

  const btnDMDice = document.querySelector(".btn-dm-dice");
  btnDMDice?.addEventListener("click", dmRollDifficulty);

  const btnAssignCombat = document.querySelector(".btn-assign-combat");
  btnAssignCombat?.addEventListener("click", assignCombat);

  setupNpcModal(gameState.gameId);
}

// Configurar listeners de navegación
function setupNavigationListeners() {
  const navbarItems = document.querySelectorAll(".navbar-item");

  const btnMyGames = navbarItems[NAVBAR_MY_GAMES_INDEX];
  btnMyGames?.addEventListener("click", redirectToMyGames);

  const btnLogout = navbarItems[NAVBAR_LOGOUT_INDEX];
  btnLogout?.addEventListener("click", () => {
    clearAuthUser();
    redirectToLogin();
  });
}

// Iniciar actualizaciones automáticas de narrativa
function startNarrativeUpdates() {
  setInterval(async () => {
    await loadNarrative();
  }, NARRATIVE_UPDATE_INTERVAL);
}

// Verificar estado del juego periódicamente
function checkGameStatus() {
  setInterval(async () => {
    try {
      const gameResponse = await getGameByLink(gameState.gameData.link);

      // Si la partida no existe o fue desactivada, expulsar al usuario
      if (!gameResponse || !gameResponse.is_active) {
        alert(ERROR_MESSAGES.GAME_ENDED);
        redirectToMyGames();
      }
    } catch (error) {
      // Ignorar errores silenciosamente durante la verificación periódica
    }
  }, GAME_STATUS_CHECK_INTERVAL);
}

// FUNCIONES PRINCIPALES

// Cargar información del juego
async function loadGameInfo() {
  try {
    if (gameState.gameData) {
      document.querySelector(".game-title").textContent =
        gameState.gameData.title || "Partida Cargada";
      document.querySelector(".game-description").textContent =
        gameState.gameData.description || "Descripción...";
    }
  } catch (error) {
    console.error("Error al cargar info del juego:", error);
  }
}

// Cargar participantes del juego
async function loadParticipants() {
  try {
    const participants = await getGameParticipants(gameState.gameId);
    gameState.participants = participants;

    // Verificar si el usuario actual es el DM del juego
    gameState.isUserDM = gameState.gameData.user_id === gameState.userId;

    const userParticipant = participants.find(
      (p) => p.user_id === gameState.userId,
    );

    if (userParticipant) {
      gameState.participantId = userParticipant.id;

      if (!gameState.isUserDM && userParticipant.character_id) {
        gameState.playerCharacterId = userParticipant.character_id;
        await loadPlayerCharacter(userParticipant.character_id);
      }
    }

    console.log("Rol del usuario:", gameState.isUserDM ? "DM" : "Jugador");
  } catch (error) {
    console.error("Error al cargar participantes:", error);
  }
}

// Configurar UI según el rol del usuario
function setupUIByRole() {
  if (gameState.isUserDM) {
    setupDMUI();
  } else {
    setupPlayerUI();
  }
}

// Configurar todos los event listeners
function setupEventListeners() {
  setupNotesListeners();
  setupChatListeners();

  if (!gameState.isUserDM) {
    setupPlayerActionsListeners();
  }

  if (gameState.isUserDM) {
    setupDMActionsListeners();
  }

  setupNavigationListeners();
}

// Cargar datos iniciales
async function loadInitialData() {
  await loadNarrative();
  await loadNotes();
  await loadChatMessages();
  await loadAndRenderInventory();

  checkGameStatus();
  startNarrativeUpdates();
}

// Inicializar juego
async function initGame() {
  try {
    const userId = checkUserAuth();
    if (!userId) return;

    gameState.userId = userId;

    const inviteCode = getInviteCodeFromUrl();
    if (!inviteCode) {
      alert(ERROR_MESSAGES.NO_INVITE);
      return;
    }

    // Obtener el juego desde la base de datos
    const gameResponse = await getGameByLink(inviteCode);
    if (!gameResponse) {
      alert(ERROR_MESSAGES.GAME_NOT_AVAILABLE);
      redirectToMyGames();
      return;
    }

    gameState.gameId = gameResponse.id;
    gameState.gameData = gameResponse;

    await loadGameInfo();
    await loadParticipants();
    setupUIByRole();
    setupEventListeners();
    await loadInitialData();
  } catch (error) {
    console.error("Error al inicializar partida:", error);
    alert(ERROR_MESSAGES.INIT_ERROR);
    redirectToMyGames();
  }
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initGame);
