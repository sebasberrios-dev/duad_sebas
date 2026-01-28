import { getAllUsers, deleteUserAccount } from "../api/user_endpoints.js";
import { getAuthUser } from "../storage/auth.js";
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
const FILTER_ADMIN = "admin";
const FILTER_PLAYER = "player";
const FILTER_DM = "dm";

const ROLE_TEXT = {
  admin: "Administrador",
  player: "Jugador",
  dm: "Dungeon Master",
  DEFAULT: "Desconocido",
};

const ROLE_CLASS = {
  admin: "role-admin",
  player: "role-player",
  dm: "role-dm",
};

const ERROR_LOAD_USERS =
  "Error al cargar los usuarios. Por favor, intenta nuevamente.";

// VARIABLES GLOBALES
let allUsersData = [];
let currentFilter = FILTER_ALL;
let currentUserId = null;

// UTILIDADES PRIVADAS

// Obtener elementos DOM
function getElements() {
  return {
    tableSection: document.getElementById("table-section"),
    noUsersMessage: document.getElementById("no-users-message"),
    tbody: document.querySelector("#usersTable tbody"),
    filterAll: document.getElementById("filter-all"),
    filterAdmin: document.getElementById("filter-admin"),
    filterPlayer: document.getElementById("filter-player"),
    filterDM: document.getElementById("filter-dm"),
    logoutBtn: document.getElementById("logoutBtn"),
    homeBtn: document.getElementById("homeBtn"),
    gamesBtn: document.getElementById("gamesBtn"),
  };
}

// Obtener texto de rol
function getRoleText(role) {
  return getMapValue(ROLE_TEXT, role, ROLE_TEXT.DEFAULT);
}

// Obtener clase de rol
function getRoleClass(role) {
  return getMapValue(ROLE_CLASS, role);
}

// Filtrar usuarios según filtro activo
function filterUsers(users, filter) {
  if (filter === FILTER_ADMIN) {
    return users.filter((u) => u.role === "admin");
  } else if (filter === FILTER_PLAYER) {
    return users.filter((u) => u.role === "player");
  } else if (filter === FILTER_DM) {
    return users.filter((u) => u.role === "dm");
  }
  return users;
}

// FUNCIONES PRINCIPALES

// Crear fila de tabla para un usuario
function createUserRow(user) {
  const template = document.getElementById("user-row-template");
  const row = template.content.cloneNode(true);

  // Llenar datos
  row.querySelector(".user-id").textContent = user.id;
  row.querySelector(".user-username").textContent = user.username;
  row.querySelector(".user-email").textContent = user.email;

  // Rol
  const roleSpan = row.querySelector(".user-role");
  roleSpan.textContent = getRoleText(user.role);
  roleSpan.className = `user-role ${getRoleClass(user.role)}`;

  // Botón eliminar
  const btn = row.querySelector(".btn-delete");
  btn.textContent = "Eliminar";

  // Deshabilitar si es el usuario actual
  if (user.id === currentUserId) {
    btn.disabled = true;
    btn.textContent = "Usuario actual";
  } else {
    btn.addEventListener("click", () =>
      handleDeleteUser(user.id, user.username),
    );
  }

  return row;
}

// Manejar eliminación de usuario
async function handleDeleteUser(userId, username) {
  const confirmed = confirm(
    `¿Estás seguro de que deseas eliminar al usuario "${username}"?`,
  );

  if (!confirmed) return;

  try {
    await deleteUserAccount(userId);
    alert(`Usuario "${username}" eliminado correctamente`);
    // Recargar datos después de la eliminación
    await loadAllUsers();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert("Error al eliminar el usuario");
  }
}

// Renderizar tabla con usuarios filtrados
function renderUsersTable(filter = FILTER_ALL) {
  const elements = getElements();
  const filteredUsers = filterUsers(allUsersData, filter);

  // Si no hay usuarios después del filtro
  if (filteredUsers.length === 0) {
    showNoDataMessage(elements.tableSection, elements.noUsersMessage);
    return;
  }

  // Mostrar tabla
  hideNoDataMessage(elements.tableSection, elements.noUsersMessage);
  clearTable(elements.tbody);

  // Crear filas
  filteredUsers.forEach((user) => {
    const row = createUserRow(user);
    elements.tbody.appendChild(row);
  });
}

// Cargar todos los usuarios
async function loadAllUsers() {
  const elements = getElements();

  try {
    const users = await getAllUsers();
    allUsersData = users;
    renderUsersTable(currentFilter);
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    showErrorMessage(elements.noUsersMessage, ERROR_LOAD_USERS);
  }
}

// Configurar listeners de filtros
function setupFilterListeners() {
  const elements = getElements();
  const filterButtons = [
    elements.filterAll,
    elements.filterAdmin,
    elements.filterPlayer,
    elements.filterDM,
  ];

  elements.filterAll.addEventListener("click", () => {
    currentFilter = FILTER_ALL;
    setActiveFilter("filter-all", filterButtons);
    renderUsersTable(currentFilter);
  });

  elements.filterAdmin.addEventListener("click", () => {
    currentFilter = FILTER_ADMIN;
    setActiveFilter("filter-admin", filterButtons);
    renderUsersTable(currentFilter);
  });

  elements.filterPlayer.addEventListener("click", () => {
    currentFilter = FILTER_PLAYER;
    setActiveFilter("filter-player", filterButtons);
    renderUsersTable(currentFilter);
  });

  elements.filterDM.addEventListener("click", () => {
    currentFilter = FILTER_DM;
    setActiveFilter("filter-dm", filterButtons);
    renderUsersTable(currentFilter);
  });
}

// Inicialización
async function init() {
  if (!checkAuthAndPermissions()) {
    return;
  }

  // Obtener ID del usuario actual
  const authUser = getAuthUser();
  currentUserId = authUser?.id || null;

  const elements = getElements();
  setupFilterListeners();
  setupNavigation(
    elements.logoutBtn,
    elements.homeBtn,
    elements.gamesBtn,
    "games",
  );
  await loadAllUsers();
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", init);
