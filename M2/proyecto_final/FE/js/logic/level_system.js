import defaultAttributes from "../utils/char_attributes.js";
import { updateCharacter } from "../api/character_endpoints.js";

// CONSTANTES
const MAX_LEVEL = 7;

const ATTRIBUTE_NAMES = {
  STRENGTH: "strength",
  DEXTERITY: "dexterity",
  INTELLIGENCE: "intelligence",
};

// UTILIDADES PRIVADAS

// Validar que el personaje no exceda el nivel máximo
function validateMaxLevel(currentLevel) {
  if (currentLevel >= MAX_LEVEL) {
    throw new Error(`El personaje ya alcanzó el nivel máximo (${MAX_LEVEL})`);
  }
}

// Obtener atributos del siguiente nivel
function getNextLevelAttributes(race, className, newLevel) {
  const newAttributes = defaultAttributes[race]?.[className]?.[newLevel];

  if (!newAttributes) {
    throw new Error(
      `No se encontraron atributos para ${race} ${className} nivel ${newLevel}`,
    );
  }

  return newAttributes;
}

// Calcular stats ganados por la subida de nivel
function calculateStatsGained(newAttributes, currentAttributes) {
  return {
    [ATTRIBUTE_NAMES.STRENGTH]:
      newAttributes.strength - currentAttributes.strength,
    [ATTRIBUTE_NAMES.DEXTERITY]:
      newAttributes.dexterity - currentAttributes.dexterity,
    [ATTRIBUTE_NAMES.INTELLIGENCE]:
      newAttributes.intelligence - currentAttributes.intelligence,
  };
}

// Construir objeto de nuevos stats
function buildNewStats(newAttributes) {
  return {
    [ATTRIBUTE_NAMES.STRENGTH]: newAttributes.strength,
    [ATTRIBUTE_NAMES.DEXTERITY]: newAttributes.dexterity,
    [ATTRIBUTE_NAMES.INTELLIGENCE]: newAttributes.intelligence,
  };
}

// Construir datos de personaje actualizado
function buildUpdatedCharacterData(newLevel, newAttributes) {
  return {
    level: newLevel,
    attributes: buildNewStats(newAttributes),
  };
}

// Formatear mensaje de nivel subido
function formatLevelUpMessage(characterName, newLevel) {
  return `¡${characterName} subió al nivel ${newLevel}!`;
}

// Construir respuesta de subida de nivel
function buildLevelUpResponse(
  characterData,
  currentLevel,
  newLevel,
  newAttributes,
  updatedCharacter,
) {
  const statsGained = calculateStatsGained(
    newAttributes,
    characterData.attributes,
  );
  const newStats = buildNewStats(newAttributes);

  return {
    success: true,
    message: formatLevelUpMessage(characterData.name, newLevel),
    oldLevel: currentLevel,
    newLevel: newLevel,
    statsGained: statsGained,
    newStats: newStats,
    updatedCharacter: updatedCharacter,
  };
}

// FUNCIONES PÚBLICAS

// Subir de nivel a un personaje
const levelUp = async (characterId, characterData) => {
  try {
    const currentLevel = characterData.level;

    // Validar que no exceda el nivel máximo
    validateMaxLevel(currentLevel);

    const newLevel = currentLevel + 1;
    const newAttributes = getNextLevelAttributes(
      characterData.race,
      characterData.class,
      newLevel,
    );

    // Preparar y enviar datos actualizados
    const updatedCharacterData = buildUpdatedCharacterData(
      newLevel,
      newAttributes,
    );
    const response = await updateCharacter(characterId, updatedCharacterData);

    // Retornar información útil
    return buildLevelUpResponse(
      characterData,
      currentLevel,
      newLevel,
      newAttributes,
      response,
    );
  } catch (error) {
    console.error("Error al subir de nivel:", error);
    throw error;
  }
};

export { levelUp };
