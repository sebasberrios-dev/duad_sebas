import { register, login } from "../api/user_endpoints.js";
import { setAuthUser } from "../storage/auth.js";

// CONSTANTES
const HOME_PAGE_URL = "/M2/proyecto_final/FE/html/home_page.html";
const REGISTER_SUCCESS_MESSAGE = "Registro exitoso.";
const LOGIN_SUCCESS_MESSAGE = "Inicio de sesión exitoso.";
const REGISTER_ERROR_TEMPLATE = "Error en el registro: ";
const LOGIN_ERROR_TEMPLATE = "Error en el inicio de sesión: ";

// UTILIDADES PRIVADAS

// Construir objeto de datos de usuario para registro
function buildUserData(email, username, password, role) {
  return {
    email: email,
    username: username,
    password: password,
    role: role,
  };
}

// Construir objeto de credenciales para login
function buildCredentials(username, password) {
  return {
    username: username,
    password: password,
  };
}

// Formatear mensaje de error
function formatErrorMessage(template, errorMessage) {
  return `${template}${errorMessage}`;
}

// Redirigir a la página de inicio
function redirectToHome() {
  window.location.href = HOME_PAGE_URL;
}

// Manejar autenticación exitosa
function handleAuthSuccess(response, successMessage) {
  console.log(successMessage);
  alert(successMessage);
  setAuthUser(response);
  redirectToHome();
}

// FUNCIONES PÚBLICAS

// Registrar nuevo usuario
export const registerUser = async (email, username, password, role) => {
  try {
    console.log("Registering user...");
    const userData = buildUserData(email, username, password, role);
    const response = await register(userData);

    if (response) {
      handleAuthSuccess(response, REGISTER_SUCCESS_MESSAGE);
    }
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    alert(formatErrorMessage(REGISTER_ERROR_TEMPLATE, error.message));
  }
};

// Iniciar sesión de usuario
export const loginUser = async (username, password) => {
  try {
    console.log("Logging in user...");
    const credentials = buildCredentials(username, password);
    const response = await login(credentials);

    if (response) {
      handleAuthSuccess(response, LOGIN_SUCCESS_MESSAGE);
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    alert(formatErrorMessage(LOGIN_ERROR_TEMPLATE, error.message));
  }
};
