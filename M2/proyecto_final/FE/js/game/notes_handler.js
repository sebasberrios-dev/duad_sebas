// MANEJO DE NOTAS

import { gameState } from "./game_state.js";
import { GameSession } from "../logic/game_flow.js";
import { deleteNote } from "../api/notes_endpoints.js";

// CONSTANTES
const NARRATIVE_PREFIX = "[NARRATIVA]";
const NOTE_TYPE_PRIVATE = "private";
const NOTE_TYPE_SHARED = "shared";

// UTILIDADES PRIVADAS

// Asegurar que existe una sesión de juego
function ensureGameSession() {
  if (!gameState.session) {
    gameState.session = new GameSession(
      gameState.gameId,
      gameState.participantId,
    );
  }
}

// Obtener y validar contenido del input de nota
function getNoteInputContent(selector) {
  const noteInput = document.querySelector(selector);
  return noteInput ? noteInput.value.trim() : "";
}

// Limpiar input de nota
function clearNoteInput(selector) {
  const noteInput = document.querySelector(selector);
  if (noteInput) {
    noteInput.value = "";
  }
}

// FILTROS DE NOTAS

// Filtrar notas privadas del DM (creadas por el DM, solo visibles para DM)
function filterDMPrivateNotes(notes) {
  return notes.filter(
    (note) =>
      !note.visible_for_players &&
      note.visible_for_dm &&
      note.user_id === gameState.userId,
  );
}

// Filtrar notas compartidas (visibles para todos, excepto narrativa)
function filterSharedNotes(notes) {
  return notes.filter(
    (note) =>
      note.visible_for_players &&
      note.visible_for_dm &&
      !note.content.startsWith(NARRATIVE_PREFIX),
  );
}

// Filtrar notas privadas del jugador actual
function filterPlayerOwnNotes(notes) {
  return notes.filter(
    (note) => !note.visible_for_players && note.user_id === gameState.userId,
  );
}

// RENDERIZADO DE NOTAS

// Crear elemento HTML de nota
function createNoteElement(note, type) {
  const noteDiv = document.createElement("div");
  noteDiv.className = `note-item ${
    type === NOTE_TYPE_PRIVATE ? "private-note" : "shared-note"
  }`;

  const typeLabel = type === NOTE_TYPE_PRIVATE ? "🔒 Privada" : "👥 Compartida";
  const dateText = new Date(note.updated_at).toLocaleString();

  noteDiv.innerHTML = `
    <div class="note-header">
      <span class="note-date">${dateText} - ${typeLabel}</span>
      <button class="btn-delete-note" data-note-id="${note.id}">×</button>
    </div>
    <p class="note-content">${note.content}</p>
  `;

  const deleteBtn = noteDiv.querySelector(".btn-delete-note");
  deleteBtn.addEventListener("click", () => handleDeleteNote(note.id));

  return noteDiv;
}

// Renderizar notas en un contenedor
function renderNotesInContainer(container, notes, type) {
  if (!container) return;

  container.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = createNoteElement(note, type);
    container.appendChild(noteElement);
  });
}

// Renderizar notas privadas del DM
function renderDMPrivateNotes(notes) {
  if (!gameState.isUserDM) return;

  const container = document.getElementById("dm-private-notes");
  const privateNotes = filterDMPrivateNotes(notes);
  renderNotesInContainer(container, privateNotes, NOTE_TYPE_PRIVATE);
}

// Renderizar notas compartidas del DM
function renderDMSharedNotes(notes) {
  if (!gameState.isUserDM) return;

  const container = document.getElementById("dm-shared-notes");
  const sharedNotes = filterSharedNotes(notes);
  renderNotesInContainer(container, sharedNotes, NOTE_TYPE_SHARED);
}

// Renderizar notas del jugador (propias privadas + compartidas del DM)
function renderPlayerNotes(notes) {
  if (gameState.isUserDM) return;

  const container = document.querySelector("#player-notes-section .notes-list");
  if (!container) return;

  container.innerHTML = "";

  const playerOwnNotes = filterPlayerOwnNotes(notes);
  const sharedNotes = filterSharedNotes(notes);

  // Primero las notas privadas del jugador
  playerOwnNotes.forEach((note) => {
    const noteElement = createNoteElement(note, NOTE_TYPE_PRIVATE);
    container.appendChild(noteElement);
  });

  // Luego las notas compartidas del DM
  sharedNotes.forEach((note) => {
    const noteElement = createNoteElement(note, NOTE_TYPE_SHARED);
    container.appendChild(noteElement);
  });
}

// Eliminar una nota
async function handleDeleteNote(noteId) {
  try {
    if (!confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      return;
    }

    await deleteNote(noteId);
    await loadNotes();
    alert("Nota eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar nota:", error);
    alert("Error al eliminar la nota");
  }
}

// FUNCIONES PÚBLICAS

// Cambia entre pestañas de notas (DM)
export const switchNoteTab = (tab) => {
  const privateTabs = document.querySelectorAll(".note-tab");
  privateTabs.forEach((t) => t.classList.remove("active"));

  const privateNotes = document.getElementById("dm-private-notes");
  const sharedNotes = document.getElementById("dm-shared-notes");

  if (tab === NOTE_TYPE_PRIVATE) {
    privateTabs[0].classList.add("active");
    privateNotes.style.display = "block";
    sharedNotes.style.display = "none";
  } else {
    privateTabs[1].classList.add("active");
    privateNotes.style.display = "none";
    sharedNotes.style.display = "block";
  }
};

// Agrega nota del DM
export const addDMNote = async () => {
  try {
    ensureGameSession();

    const content = getNoteInputContent("#dm-notes-section .note-input");

    if (!content) {
      alert("Escribe una nota primero");
      return;
    }

    const isShared = document.getElementById("note-shared").checked;

    if (isShared) {
      await gameState.session.addPublicNote(content);
    } else {
      await gameState.session.addDMNote(content);
    }

    clearNoteInput("#dm-notes-section .note-input");
    await loadNotes();
    alert("Nota agregada");
  } catch (error) {
    console.error("Error al agregar nota:", error);
    alert("Error al agregar nota");
  }
};

// Agrega nota del jugador
export const addPlayerNote = async () => {
  try {
    ensureGameSession();

    const content = getNoteInputContent("#player-notes-section .note-input");

    if (!content) {
      alert("Escribe una nota primero");
      return;
    }

    // Las notas de jugador son privadas (solo DM puede ver)
    await gameState.session.addDMNote(content);

    clearNoteInput("#player-notes-section .note-input");
    await loadNotes();
    alert("Nota privada agregada");
  } catch (error) {
    console.error("Error al agregar nota:", error);
    alert("Error al agregar nota");
  }
};

// Carga las notas
export const loadNotes = async () => {
  try {
    ensureGameSession();

    const { notes } = await gameState.session.getNotes();
    const notesArray = notes || [];

    renderDMPrivateNotes(notesArray);
    renderDMSharedNotes(notesArray);
    renderPlayerNotes(notesArray);
  } catch (error) {
    console.error("Error al cargar notas:", error);
  }
};
