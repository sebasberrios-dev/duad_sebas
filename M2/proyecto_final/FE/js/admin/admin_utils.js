import { isAdmin, isAuthenticated, clearAuthUser } from "../storage/auth.js";

// CONSTANTES
export const DISPLAY_VISIBLE = "block";
export const DISPLAY_HIDDEN = "none";

// FUNCIONES DE UTILIDAD

// Limpiar contenido de la tabla
export function clearTable(tbody) {
  if (tbody) {
    tbody.innerHTML = "";
  }
}

// Mostrar mensaje cuando no hay datos
export function showNoDataMessage(tableSection, noDataMessage) {
  tableSection.style.display = DISPLAY_HIDDEN;
  noDataMessage.style.display = DISPLAY_VISIBLE;
}

// Ocultar mensaje de sin datos y mostrar tabla
export function hideNoDataMessage(tableSection, noDataMessage) {
  noDataMessage.style.display = DISPLAY_HIDDEN;
  tableSection.style.display = DISPLAY_VISIBLE;
}

// Mostrar mensaje de error
export function showErrorMessage(messageElement, errorText) {
  messageElement.style.display = DISPLAY_VISIBLE;
  messageElement.innerHTML = `
    <p style="font-size: 1.3rem; color: rgba(255, 100, 100, 0.9)">
      ${errorText}
    </p>
  `;
}

// Cambiar filtro activo visualmente
export function setActiveFilter(activeId, filterButtons) {
  filterButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(activeId).classList.add("active");
}

// Configurar navegación (logout, home y sección que corresponda)
export function setupNavigation(logoutBtn, homeBtn, sectionBtn, sectionName) {
  logoutBtn.addEventListener("click", () => {
    clearAuthUser();
    window.location.href = "./login_admin.html";
  });

  homeBtn.addEventListener("click", () => {
    window.location.reload();
  });

  if (sectionBtn && sectionName) {
    sectionBtn.addEventListener("click", () => {
      window.location.href = `./${sectionName}.html`;
    });
  }
}

// Verificar autenticación y permisos de administrador
export function checkAuthAndPermissions() {
  if (!isAuthenticated()) {
    alert("Debes iniciar sesión para acceder a esta página");
    window.location.href = "../login.html";
    return false;
  }

  if (!isAdmin()) {
    alert("No tienes permisos para acceder a esta página");
    window.location.href = "../index.html";
    return false;
  }

  return true;
}

// Obtener valor de mapa o valor por defecto
export function getMapValue(map, key, defaultValue = "Desconocido") {
  return map[key] || defaultValue;
}
