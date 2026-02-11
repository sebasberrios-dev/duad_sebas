import { getAuthUser } from "../storage/auth.js";
import { verifyAuth } from "../utils/verifications.js";
import { homeNavListeners } from "../utils/renderization_utils.js";

// CONSTANTES
const NAVBAR_CREATE_CHAR_INDEX = 1;
const NAVBAR_CREATE_GAME_INDEX = 2;
const NAVBAR_JOIN_GAME_INDEX = 3;

const USER_ROLES = {
  PLAYER: "player",
  DM: "dm",
  ADMIN: "admin",
};

const DISPLAY_VISIBLE = "block";
const DISPLAY_HIDDEN = "none";

// UTILIDADES PRIVADAS

// Obtener items de la navbar por índice
function getNavbarItems() {
  const items = document.querySelectorAll(".navbar-item");
  return {
    createChar: items[NAVBAR_CREATE_CHAR_INDEX],
    createGame: items[NAVBAR_CREATE_GAME_INDEX],
    joinGame: items[NAVBAR_JOIN_GAME_INDEX],
  };
}

// Configurar visibilidad de un item
function setItemVisibility(item, visible) {
  if (item) {
    item.style.display = visible ? DISPLAY_VISIBLE : DISPLAY_HIDDEN;
  }
}

// Configurar visibilidad para rol Player
function setupPlayerNavbar(items) {
  setItemVisibility(items.createChar, true);
  setItemVisibility(items.createGame, false);
  setItemVisibility(items.joinGame, true);
}

// Configurar visibilidad para rol DM
function setupDMNavbar(items) {
  setItemVisibility(items.createChar, false);
  setItemVisibility(items.createGame, true);
  setItemVisibility(items.joinGame, false);
}

// Configurar visibilidad para rol Admin
function setupAdminNavbar(items) {
  setItemVisibility(items.createChar, true);
  setItemVisibility(items.createGame, true);
  setItemVisibility(items.joinGame, true);
}

// Configurar navbar según rol del usuario
function configureNavbarByRole(role, items) {
  switch (role) {
    case USER_ROLES.PLAYER:
      setupPlayerNavbar(items);
      break;
    case USER_ROLES.DM:
      setupDMNavbar(items);
      break;
    case USER_ROLES.ADMIN:
      setupAdminNavbar(items);
      break;
    default:
      console.error("Rol desconocido:", role);
  }
}

// FUNCIONES PRINCIPALES

// Renderizar barra de navegación según rol del usuario
function renderNavBar() {
  try {
    const user = getAuthUser();

    if (!user || !user.role) {
      console.error("No se pudo obtener el usuario o su rol");
      return;
    }

    const navbarItems = getNavbarItems();
    configureNavbarByRole(user.role, navbarItems);
  } catch (error) {
    console.error("Error al renderizar la barra de navegación:", error);
  }
}

// Inicializar página
function initializePage() {
  if (verifyAuth()) {
    renderNavBar();
    homeNavListeners();
  }
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
