// CONSTANTES
const DEFAULT_MAX_LEVEL = 7;
const INITIAL_LEVEL = 1;

const ATTRIBUTE_NAMES = {
  STRENGTH: "strength",
  DEXTERITY: "dexterity",
  INTELLIGENCE: "intelligence",
};

// UTILIDADES PRIVADAS

// Calcular valor de atributo para un nivel específico
function calculateAttributeValue(baseValue, growthRate, level) {
  return baseValue + Math.floor((level - INITIAL_LEVEL) * growthRate);
}

// Generar stats para un nivel específico
function generateStatsForLevel(baseStats, growthPattern, level) {
  return {
    [ATTRIBUTE_NAMES.STRENGTH]: calculateAttributeValue(
      baseStats.strength,
      growthPattern.strength,
      level,
    ),
    [ATTRIBUTE_NAMES.DEXTERITY]: calculateAttributeValue(
      baseStats.dexterity,
      growthPattern.dexterity,
      level,
    ),
    [ATTRIBUTE_NAMES.INTELLIGENCE]: calculateAttributeValue(
      baseStats.intelligence,
      growthPattern.intelligence,
      level,
    ),
  };
}

// Generar niveles automáticamente basados en stats base y patrón de crecimiento
function generateLevels(
  baseStats,
  growthPattern,
  maxLevel = DEFAULT_MAX_LEVEL,
) {
  const levels = {};

  for (let level = INITIAL_LEVEL; level <= maxLevel; level++) {
    levels[level] = generateStatsForLevel(baseStats, growthPattern, level);
  }

  return levels;
}

// Verificar si el patrón de crecimiento es cero
function hasNoGrowth(growthPattern) {
  return (
    growthPattern.strength === 0 &&
    growthPattern.dexterity === 0 &&
    growthPattern.intelligence === 0
  );
}

// Generar atributos para una clase específica
function generateClassAttributes(config) {
  if (hasNoGrowth(config.growth)) {
    return config.base;
  }
  return generateLevels(config.base, config.growth);
}

// CONFIGURACIÓN DE RAZAS Y CLASES

// Definición de stats base (nivel 1) y patrones de crecimiento por nivel
const raceClassConfig = {
  human: {
    warrior: {
      base: { strength: 7, dexterity: 5, intelligence: 4 },
      growth: { strength: 1, dexterity: 0.5, intelligence: 0.33 },
    },
    mage: {
      base: { strength: 4, dexterity: 5, intelligence: 7 },
      growth: { strength: 0.33, dexterity: 0.5, intelligence: 1 },
    },
    rogue: {
      base: { strength: 5, dexterity: 7, intelligence: 4 },
      growth: { strength: 0.5, dexterity: 1, intelligence: 0.33 },
    },
    cleric: {
      base: { strength: 4, dexterity: 4, intelligence: 8 },
      growth: { strength: 0.5, dexterity: 0.5, intelligence: 1 },
    },
  },
  elf: {
    warrior: {
      base: { strength: 5, dexterity: 7, intelligence: 4 },
      growth: { strength: 0.5, dexterity: 1, intelligence: 0.33 },
    },
    mage: {
      base: { strength: 4, dexterity: 5, intelligence: 7 },
      growth: { strength: 0.33, dexterity: 0.5, intelligence: 1 },
    },
    rogue: {
      base: { strength: 4, dexterity: 7, intelligence: 5 },
      growth: { strength: 0.5, dexterity: 1, intelligence: 0.33 },
    },
    cleric: {
      base: { strength: 3, dexterity: 5, intelligence: 8 },
      growth: { strength: 0.5, dexterity: 0.5, intelligence: 1 },
    },
  },
  dwarf: {
    warrior: {
      base: { strength: 8, dexterity: 4, intelligence: 3 },
      growth: { strength: 1, dexterity: 0.33, intelligence: 0.33 },
    },
    mage: {
      base: { strength: 3, dexterity: 4, intelligence: 8 },
      growth: { strength: 0.33, dexterity: 0.33, intelligence: 1 },
    },
    rogue: {
      base: { strength: 6, dexterity: 5, intelligence: 4 },
      growth: { strength: 1, dexterity: 0.33, intelligence: 0.33 },
    },
    cleric: {
      base: { strength: 5, dexterity: 4, intelligence: 7 },
      growth: { strength: 0.5, dexterity: 0.5, intelligence: 1 },
    },
  },
  orc: {
    warrior: {
      base: { strength: 9, dexterity: 3, intelligence: 2 },
      growth: { strength: 1, dexterity: 0.33, intelligence: 0.33 },
    },
    mage: {
      base: { strength: 2, dexterity: 4, intelligence: 9 },
      growth: { strength: 0.33, dexterity: 0.33, intelligence: 1 },
    },
    rogue: {
      base: { strength: 5, dexterity: 6, intelligence: 3 },
      growth: { strength: 0.33, dexterity: 1, intelligence: 0.33 },
    },
    cleric: {
      base: { strength: 4, dexterity: 4, intelligence: 8 },
      growth: { strength: 0.5, dexterity: 0.5, intelligence: 1 },
    },
  },
};

// GENERACIÓN DE ATRIBUTOS

// Generar el objeto de atributos completo para todas las razas y clases
const defaultAttributes = {};

for (const [race, classes] of Object.entries(raceClassConfig)) {
  defaultAttributes[race] = {};

  for (const [className, config] of Object.entries(classes)) {
    defaultAttributes[race][className] = generateClassAttributes(config);
  }
}

export default defaultAttributes;
