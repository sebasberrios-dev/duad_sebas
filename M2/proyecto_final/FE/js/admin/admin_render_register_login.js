import { registerAdmin, loginAdmin } from "./admin_register_login.js";

// CONSTANTES
const INCOMPLETE_FIELDS_MESSAGE =
  "Por favor, complete todos los campos obligatorios.";

// Obtener datos del formulario de registro
function getAdminRegisterData() {
  return {
    email: document.getElementById("admin-email").value.trim(),
    username: document.getElementById("admin-username").value.trim(),
    password: document.getElementById("admin-password").value.trim(),
  };
}

// Obtener datos del formulario de login
function getAdminLoginData() {
  return {
    username: document.getElementById("admin-username").value.trim(),
    password: document.getElementById("admin-password").value.trim(),
  };
}

// Validar datos de registro
function validateAdminRegisterData(email, username, password) {
  if (!email || !username || !password) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }
  return true;
}

// Validar datos de login
function validateAdminLoginData(username, password) {
  if (!username || !password) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }
  return true;
}

// Manejar evento de registro de administrador
async function handleAdminRegister(e) {
  e.preventDefault();
  const { email, username, password } = getAdminRegisterData();

  if (!validateAdminRegisterData(email, username, password)) {
    return;
  }

  await registerAdmin(email, username, password);
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const { username, password } = getAdminLoginData();

  if (!validateAdminLoginData(username, password)) {
    return;
  }

  await loginAdmin(username, password);
}

// FUNCIONES PRINCIPALES

function setupAdminForm() {
  const registerForm = document.getElementById("admin-register-form");
  const loginForm = document.getElementById("admin-login-form");

  if (registerForm) {
    registerForm.addEventListener("submit", handleAdminRegister);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleAdminLogin);
  }
}

// Inicializar módulo de registro/login de administrador

function initializePage() {
  setupAdminForm();
}

document.addEventListener("DOMContentLoaded", initializePage);
