import { isAuthenticated } from "../storage/auth.js";
import { contactNavListeners } from "../utils/renderization_utils.js";

const renderLogText = () => {
  try {
    const logTextElement = document.querySelectorAll(".navbar-item")[2];
    if (!isAuthenticated()) {
      logTextElement.textContent = "Iniciar Sesión";
    } else {
      logTextElement.textContent = "Cerrar Sesión";
    }
  } catch (error) {
    console.error("Error al renderizar:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderLogText();
  contactNavListeners();
});
