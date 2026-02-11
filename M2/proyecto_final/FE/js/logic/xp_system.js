import { levelUp } from "./level_system.js";
import {
  addXPToCharacter,
  getCharacterById,
  updateCharacter,
} from "../api/character_endpoints.js";

// CONSTANTES
const MAX_LEVEL = 7;
const MAX_XP_BAR_PERCENTAGE = 100;
const MAX_LEVEL_TEXT = "NIVEL MÁXIMO";

// Tabla de XP necesario por nivel
const XP_TABLE = {
  1: 100,
  2: 200,
  3: 400,
  4: 800,
  5: 1600,
  6: 3200,
};

// UTILIDADES PRIVADAS

// Verificar si el personaje está en nivel máximo
function isMaxLevel(level) {
  return level >= MAX_LEVEL;
}

// Verificar si el personaje puede subir de nivel
function canLevelUp(currentXP, currentLevel) {
  const xpNeeded = XP_TABLE[currentLevel];
  return currentXP >= xpNeeded;
}

// Calcular XP restante después de subir de nivel
function calculateRemainingXP(currentXP, currentLevel) {
  const xpNeeded = XP_TABLE[currentLevel];
  return currentXP - xpNeeded;
}

// Construir resultado de nivel máximo
function buildMaxLevelResult(character) {
  return {
    leveledUp: false,
    maxLevel: true,
    currentXP: character.xp,
    currentLevel: character.level,
  };
}

// Construir resultado de subida de nivel
function buildLevelUpResult(levelUpResult, remainingXP) {
  return {
    leveledUp: true,
    newLevel: levelUpResult.newLevel,
    statsGained: levelUpResult.statsGained,
    currentXP: remainingXP,
    currentLevel: levelUpResult.newLevel,
  };
}

// Construir resultado sin subida de nivel
function buildNoLevelUpResult(character) {
  const xpNeeded = XP_TABLE[character.level];
  return {
    leveledUp: false,
    currentXP: character.xp,
    currentLevel: character.level,
    xpNeeded: xpNeeded,
    xpRemaining: xpNeeded - character.xp,
  };
}

// Calcular porcentaje de progreso de XP
function calculateXPPercentage(currentXP, xpNeeded) {
  return (currentXP / xpNeeded) * MAX_XP_BAR_PERCENTAGE;
}

// Obtener elementos DOM de la barra de XP
function getXPBarElements() {
  return {
    xpText: document.getElementById("xp-text"),
    xpBar: document.getElementById("xp-bar"),
    levelValue: document.getElementById("player-level-value"),
  };
}

// Actualizar UI para nivel máximo
function updateMaxLevelUI(elements) {
  elements.xpText.textContent = MAX_LEVEL_TEXT;
  elements.xpBar.style.width = `${MAX_XP_BAR_PERCENTAGE}%`;
}

// Actualizar UI para nivel en progreso
function updateProgressUI(elements, currentXP, xpNeeded) {
  const percentage = calculateXPPercentage(currentXP, xpNeeded);
  elements.xpText.textContent = `${currentXP} / ${xpNeeded}`;
  elements.xpBar.style.width = `${percentage}%`;
}

// FUNCIONES PÚBLICAS

// Otorga XP al personaje y verifica subida de nivel automática
export async function grantXP(characterId, xpAmount) {
  try {
    // Agregar XP a la base de datos
    await addXPToCharacter(characterId, xpAmount);

    // Obtener datos actualizados del personaje
    const character = await getCharacterById(characterId);

    // Verificar que el personaje existe
    if (!character) {
      throw new Error("Personaje no encontrado");
    }

    // Verificar si está en nivel máximo
    if (isMaxLevel(character.level)) {
      return buildMaxLevelResult(character);
    }

    // Verificar si alcanzó el XP necesario para subir de nivel
    if (canLevelUp(character.xp, character.level)) {
      // Subir de nivel usando levelUp de game_utils
      const levelUpResult = await levelUp(characterId, character);

      // Calcular XP restante después de subir de nivel
      const remainingXP = calculateRemainingXP(character.xp, character.level);

      // Resetear XP a 0 + excedente
      await updateCharacter(characterId, { xp: remainingXP });

      return buildLevelUpResult(levelUpResult, remainingXP);
    }

    // No subió de nivel
    return buildNoLevelUpResult(character);
  } catch (error) {
    console.error("Error al otorgar XP:", error);
    throw error;
  }
}

// Actualiza la barra de XP en la UI
export function updateXPBar(currentXP, currentLevel) {
  const elements = getXPBarElements();

  if (!elements.xpText || !elements.xpBar || !elements.levelValue) return;

  // Actualizar nivel
  elements.levelValue.textContent = currentLevel;

  // Si está en nivel 7, mostrar máximo
  if (isMaxLevel(currentLevel)) {
    updateMaxLevelUI(elements);
    return;
  }

  // Calcular y actualizar progreso
  const xpNeeded = XP_TABLE[currentLevel];
  updateProgressUI(elements, currentXP, xpNeeded);
}
