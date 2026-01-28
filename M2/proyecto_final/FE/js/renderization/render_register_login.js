import { registerUser, loginUser } from "../logic/register_login.js";
import { registerLoginNavListeners } from "../utils/renderization_utils.js";

// CONSTANTES
export const INCOMPLETE_FIELDS_MESSAGE =
  "Por favor, complete todos los campos obligatorios.";

// UTILIDADES PRIVADAS

// Obtener datos del formulario de registro
function getRegisterFormData() {
  return {
    email: document.getElementById("email").value.trim(),
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim(),
    role: document.getElementById("role").value,
  };
}

// Obtener datos del formulario de login
function getLoginFormData() {
  return {
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim(),
  };
}

// Validar datos de registro
function validateRegisterData(email, username, password, role) {
  if (!email || !username || !password || !role) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }
  return true;
}

// Validar datos de login
function validateLoginData(username, password) {
  if (!username || !password) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }
  return true;
}

// Manejar envío del formulario de registro
async function handleRegisterSubmit(e) {
  e.preventDefault();

  const { email, username, password, role } = getRegisterFormData();

  if (!validateRegisterData(email, username, password, role)) {
    return;
  }

  await registerUser(email, username, password, role);
}

// Manejar envío del formulario de login
async function handleLoginSubmit(e) {
  e.preventDefault();

  const { username, password } = getLoginFormData();

  if (!validateLoginData(username, password)) {
    return;
  }

  await loginUser(username, password);
}

// FUNCIONES PRINCIPALES

// Configurar formularios de registro y login
function setupForm() {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
}

// Inicializar página
function initializePage() {
  setupForm();
  registerLoginNavListeners();
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", initializePage);
