// CONSTANTES
const AUTH_USER_KEY = "authUser";

// ESTADO
let currentUser = null;

// UTILIDADES PRIVADAS

// Guardar usuario en localStorage
function saveUserToStorage(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

// Cargar usuario desde localStorage
function loadUserFromStorage() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

// Eliminar usuario de localStorage
function removeUserFromStorage() {
  localStorage.removeItem(AUTH_USER_KEY);
}

// FUNCIONES PÚBLICAS

// Establecer usuario autenticado
export const setAuthUser = (user) => {
  try {
    currentUser = user;
    saveUserToStorage(user);
    console.log("User authenticated:", user);
  } catch (error) {
    console.error("Error setting auth user:", error);
  }
};

// Obtener usuario autenticado
export const getAuthUser = () => {
  try {
    if (!currentUser) {
      currentUser = loadUserFromStorage();
    }
    return currentUser;
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
};

// Verificar si hay un usuario autenticado
export const isAuthenticated = () => {
  try {
    return !!getAuthUser();
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Limpiar usuario autenticado (logout)
export const clearAuthUser = () => {
  try {
    currentUser = null;
    removeUserFromStorage();
    sessionStorage.clear();
    console.log("User logged out");
  } catch (error) {
    console.error("Error clearing auth user:", error);
  }
};
