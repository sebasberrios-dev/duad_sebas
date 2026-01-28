import { register, login } from "../api/user_endpoints.js";
import { setAuthUser } from "../storage/auth.js";
import {
  REGISTER_ERROR_TEMPLATE,
  REGISTER_SUCCESS_MESSAGE,
  LOGIN_SUCCESS_MESSAGE,
  LOGIN_ERROR_TEMPLATE,
  buildCredentials,
  buildUserData,
  formatErrorMessage,
} from "../logic/register_login.js";

// CONSTANTES
const GAMES_PAGE_URL = "/M2/proyecto_final/FE/html/admin/games.html";

// Redirigir a la página de juegos
function redirectToGamesPage() {
  window.location.href = GAMES_PAGE_URL;
}

// Manejar autenticación exitosa
function handleAuthSuccess(response, successMessage) {
  console.log(successMessage);
  alert(successMessage);
  setAuthUser(response);
  redirectToGamesPage();
}

// Registrar administrador
export const registerAdmin = async (email, username, password) => {
  try {
    console.log("Registering admin...");
    const userData = buildUserData(email, username, password, "admin");
    const response = await register(userData);

    if (response) {
      handleAuthSuccess(response, REGISTER_SUCCESS_MESSAGE);
    }
  } catch (error) {
    console.error("Error registering admin:", error);
    alert(formatErrorMessage(REGISTER_ERROR_TEMPLATE, error.message));
  }
};

// Iniciar sesión como administrador
export const loginAdmin = async (username, password) => {
  try {
    console.log("Logging in admin...");
    const credentials = buildCredentials(username, password);
    const response = await login(credentials);

    if (response) {
      handleAuthSuccess(response, LOGIN_SUCCESS_MESSAGE);
    }
  } catch (error) {
    console.error("Error logging in admin:", error);
    alert(formatErrorMessage(LOGIN_ERROR_TEMPLATE, error.message));
  }
};
