// MANEJO DE NARRATIVA

import { gameState } from "./game_state.js";
import { GameSession } from "../logic/game_flow.js";

// CONSTANTES
const NARRATIVE_PREFIX = "[NARRATIVA]";

// Asegurar que existe una sesión de juego
function ensureGameSession() {
  if (!gameState.session) {
    gameState.session = new GameSession(
      gameState.gameId,
      gameState.participantId,
    );
  }
}

// Verificar si una nota es de narrativa
function isNarrativeNote(note) {
  return (
    note.visible_for_players &&
    note.visible_for_dm &&
    note.content.startsWith(NARRATIVE_PREFIX)
  );
}

// Remover prefijo de narrativa del contenido
function removeNarrativePrefix(content) {
  return content.replace(NARRATIVE_PREFIX, "");
}

// Crear elemento HTML para una entrada de narrativa
function createNarrativeElement(note) {
  const entry = document.createElement("div");
  entry.className = "narrative-entry";

  const content = removeNarrativePrefix(note.content);
  entry.innerHTML = `
    <span class="narrative-author">${note.username || "DM"}:</span>
    <p class="narrative-text">${content}</p>
  `;

  return entry;
}

// Hacer scroll automático al final del contenedor
function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

// FUNCIONES PÚBLICAS

// Envía narrativa del DM
export const sendNarrative = async () => {
  try {
    ensureGameSession();

    const narrativeInput = document.getElementById("dm-narrative");
    const content = narrativeInput.value.trim();

    if (!content) {
      alert("Escribe la narrativa primero");
      return;
    }

    await gameState.session.addPublicNote(`${NARRATIVE_PREFIX}${content}`);
    narrativeInput.value = "";
    await loadNarrative();
  } catch (error) {
    console.error("Error al enviar narrativa:", error);
    alert("Error al enviar narrativa");
  }
};

// Carga la narrativa
export const loadNarrative = async () => {
  try {
    ensureGameSession();

    const { notes } = await gameState.session.getNotes();

    // Filtrar solo notas de narrativa
    const narrativeNotes = (notes || []).filter(isNarrativeNote);

    const narrativeDisplay = document.querySelector(".narrative-display");
    narrativeDisplay.innerHTML = "";

    narrativeNotes.forEach((note) => {
      const entry = createNarrativeElement(note);
      narrativeDisplay.appendChild(entry);
    });

    scrollToBottom(narrativeDisplay);
  } catch (error) {
    console.error("Error al cargar narrativa:", error);
  }
};
