import { isAuthenticated, clearAuthUser } from "../storage/auth.js";

// CONSTANTES

const ROUTES = {
  HOME: "/M2/proyecto_final/FE/html/home_page.html",
  CREATE_CHAR: "/M2/proyecto_final/FE/html/create_char.html",
  CREATE_GAME: "/M2/proyecto_final/FE/html/create_game.html",
  JOIN_GAME: "/M2/proyecto_final/FE/html/join_game.html",
  MY_GAMES: "/M2/proyecto_final/FE/html/my_games.html",
  CONTACT: "/M2/proyecto_final/FE/html/contact_me.html",
  LOGIN: "/M2/proyecto_final/FE/html/login.html",
};

const NAVBAR_SELECTOR = ".navbar-item";

// Índices de navbar para setupNavigationListeners (3 items)
const NAV_INDICES_BASIC = {
  DND: 0,
  CONTACT: 1,
  LOGOUT: 2,
};

// Índices de navbar para homeNavListeners (7 items)
const NAV_INDICES_HOME = {
  DND: 0,
  CREATE_CHAR: 1,
  CREATE_GAME: 2,
  JOIN_GAME: 3,
  MY_GAMES: 4,
  CONTACT: 5,
  LOGOUT: 6,
};

// Índices de navbar para contactNavListeners (3 items)
const NAV_INDICES_CONTACT = {
  DND: 0,
  CONTACT: 1,
  LOG: 2,
};

// Índices de navbar para myGamesNavListeners (4 items)
const NAV_INDICES_MY_GAMES = {
  DND: 0,
  HOME: 1,
  CONTACT: 2,
  LOGOUT: 3,
};

// Índices de navbar para registerLoginNavListeners (3 items)
const NAV_INDICES_REGISTER_LOGIN = {
  DND: 0,
  CONTACT: 1,
  LOG: 2,
};

// UTILIDADES PRIVADAS

// Obtener todos los items de navbar
function getNavbarItems() {
  return document.querySelectorAll(NAVBAR_SELECTOR);
}

// Navegar a una ruta
function navigateToRoute(route) {
  window.location.href = route;
}

// Manejar logout: limpiar auth y redirigir a login
function handleLogout() {
  clearAuthUser();
  navigateToRoute(ROUTES.LOGIN);
}

// Agregar listener de navegación a un botón
function addNavigationListener(button, route) {
  button?.addEventListener("click", () => navigateToRoute(route));
}

// Agregar listener de logout a un botón
function addLogoutListener(button) {
  button?.addEventListener("click", handleLogout);
}

// FUNCIONES PÚBLICAS

// Configurar listeners de navegación básica (DND, Contact, Logout)
const setupNavigationListeners = () => {
  const navItems = getNavbarItems();

  addNavigationListener(navItems[NAV_INDICES_BASIC.DND], ROUTES.HOME);
  addNavigationListener(navItems[NAV_INDICES_BASIC.CONTACT], ROUTES.CONTACT);
  addLogoutListener(navItems[NAV_INDICES_BASIC.LOGOUT]);
};

// Configurar listeners de navegación para home page
const homeNavListeners = () => {
  const navItems = getNavbarItems();

  addNavigationListener(navItems[NAV_INDICES_HOME.DND], ROUTES.HOME);
  addNavigationListener(
    navItems[NAV_INDICES_HOME.CREATE_CHAR],
    ROUTES.CREATE_CHAR,
  );
  addNavigationListener(
    navItems[NAV_INDICES_HOME.CREATE_GAME],
    ROUTES.CREATE_GAME,
  );
  addNavigationListener(navItems[NAV_INDICES_HOME.JOIN_GAME], ROUTES.JOIN_GAME);
  addNavigationListener(navItems[NAV_INDICES_HOME.MY_GAMES], ROUTES.MY_GAMES);
  addNavigationListener(navItems[NAV_INDICES_HOME.CONTACT], ROUTES.CONTACT);
  addLogoutListener(navItems[NAV_INDICES_HOME.LOGOUT]);
};

// Configurar listeners de navegación para contact page
const contactNavListeners = () => {
  const navItems = getNavbarItems();

  addNavigationListener(navItems[NAV_INDICES_CONTACT.DND], ROUTES.HOME);
  addNavigationListener(navItems[NAV_INDICES_CONTACT.CONTACT], ROUTES.CONTACT);

  // Botón de log (login o logout según autenticación)
  navItems[NAV_INDICES_CONTACT.LOG]?.addEventListener("click", () => {
    if (isAuthenticated()) {
      handleLogout();
    } else {
      navigateToRoute(ROUTES.LOGIN);
    }
  });
};

// Configurar listeners de navegación para my games page
const myGamesNavListeners = () => {
  const navItems = getNavbarItems();

  addNavigationListener(navItems[NAV_INDICES_MY_GAMES.DND], ROUTES.HOME);
  addNavigationListener(navItems[NAV_INDICES_MY_GAMES.HOME], ROUTES.HOME);
  addNavigationListener(navItems[NAV_INDICES_MY_GAMES.CONTACT], ROUTES.CONTACT);
  addLogoutListener(navItems[NAV_INDICES_MY_GAMES.LOGOUT]);
};

// Configurar listeners de navegación para register/login page
const registerLoginNavListeners = () => {
  const navItems = getNavbarItems();

  addNavigationListener(navItems[NAV_INDICES_REGISTER_LOGIN.DND], ROUTES.HOME);
  addNavigationListener(
    navItems[NAV_INDICES_REGISTER_LOGIN.CONTACT],
    ROUTES.CONTACT,
  );
  addNavigationListener(navItems[NAV_INDICES_REGISTER_LOGIN.LOG], ROUTES.LOGIN);
};

export {
  setupNavigationListeners,
  homeNavListeners,
  contactNavListeners,
  registerLoginNavListeners,
  myGamesNavListeners,
};
