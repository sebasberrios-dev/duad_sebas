import { createNote, getGameNotes } from "../api/notes_endpoints.js";
import { createDT, getGameDTs } from "../api/throws_endpoints.js";

// SISTEMA DE FLUJO DE JUEGO

// CONSTANTES
const DEFAULT_DART_TYPE = "d20";
const DEFAULT_DICE_SIDES = 20;
const MIN_DICE_VALUE = 1;

// UTILIDADES PRIVADAS

// Extraer número de lados del tipo de dado
function parseDartType(dartType) {
  return parseInt(dartType.substring(1)); // 'd20' -> 20
}

// Lanzar dado (solo local)
const rollDice = (sides = DEFAULT_DICE_SIDES) => {
  return Math.floor(Math.random() * sides) + MIN_DICE_VALUE;
};

// Construir objeto de nota privada del DM
function buildDMNoteData(gameId, content) {
  return {
    game_id: gameId,
    visible_for_players: false,
    visible_for_dm: true,
    content: content,
  };
}

// Construir objeto de nota pública
function buildPublicNoteData(gameId, content) {
  return {
    game_id: gameId,
    visible_for_players: true,
    visible_for_dm: true,
    content: content,
  };
}

// Construir objeto de tirada de dado
function buildThrowData(
  gameId,
  participantId,
  dartType,
  visibleToPlayers,
  throwValue,
) {
  return {
    game_id: gameId,
    participant_id: participantId,
    dart_type: dartType,
    visible_to_dm: true,
    visible_to_players: visibleToPlayers,
    throw_value: throwValue,
  };
}

// ============================================================================
// NARRATIVA Y NOTAS
// ============================================================================

// DM agrega nota (visible solo para DM por defecto)
const addDMNote = async (gameId, content) => {
  try {
    const noteData = buildDMNoteData(gameId, content);
    const note = await createNote(noteData);
    return { success: true, note };
  } catch (error) {
    console.error("Error al agregar nota DM:", error);
    throw error;
  }
};

// Agrega nota visible para todos
const addPublicNote = async (gameId, content) => {
  try {
    const noteData = buildPublicNoteData(gameId, content);
    const note = await createNote(noteData);
    return { success: true, note };
  } catch (error) {
    console.error("Error al agregar nota pública:", error);
    throw error;
  }
};

// Obtener notas del juego
const getGameNarrative = async (gameId) => {
  try {
    const notes = await getGameNotes(gameId);
    return { success: true, notes };
  } catch (error) {
    console.error("Error al obtener notas:", error);
    throw error;
  }
};

// ============================================================================
//  DADOS
// ============================================================================

// Lanzar y guardar tirada
const throwDart = async (
  gameId,
  participantId,
  dartType = DEFAULT_DART_TYPE,
  visibleToPlayers = false,
) => {
  try {
    const sides = parseDartType(dartType);
    const throwValue = rollDice(sides);
    const throwDataObj = buildThrowData(
      gameId,
      participantId,
      dartType,
      visibleToPlayers,
      throwValue,
    );
    const throwData = await createDT(throwDataObj);

    return { success: true, throwValue, throwData };
  } catch (error) {
    console.error("Error al lanzar dado:", error);
    throw error;
  }
};

// Obtener tiradas del juego
const getGameThrows = async (gameId) => {
  try {
    const throws = await getGameDTs(gameId);
    return { success: true, throws };
  } catch (error) {
    console.error("Error al obtener tiradas:", error);
    throw error;
  }
};

// ============================================================================
// CLASE GAME SESSION
// ============================================================================

class GameSession {
  constructor(gameId, participantId = null) {
    this.gameId = gameId;
    this.participantId = participantId;
  }

  // Notas
  async addDMNote(content) {
    return await addDMNote(this.gameId, content);
  }

  async addPublicNote(content) {
    return await addPublicNote(this.gameId, content);
  }

  async getNotes() {
    return await getGameNarrative(this.gameId);
  }

  // Dados
  async throwDart(dartType = DEFAULT_DART_TYPE, visibleToPlayers = false) {
    if (!this.participantId) {
      throw new Error("Se requiere participant_id para lanzar dados");
    }
    return await throwDart(
      this.gameId,
      this.participantId,
      dartType,
      visibleToPlayers,
    );
  }

  async getThrows() {
    return await getGameThrows(this.gameId);
  }
}

export { GameSession };
