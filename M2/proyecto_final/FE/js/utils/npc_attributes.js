// CONSTANTES
const DEFAULT_MAX_LEVEL = 7;
const INITIAL_LEVEL = 1;
const DEFAULT_GROWTH_RATE = 0;

// UTILIDADES PRIVADAS

// Calcular valor de un atributo NPC para un nivel específico
function calculateNpcAttributeValue(baseValue, growthRate, level) {
  return baseValue + Math.floor((level - INITIAL_LEVEL) * growthRate);
}

// Generar stats de NPC para un nivel específico
function generateNpcStatsForLevel(baseStats, growthPattern, level) {
  const stats = {};

  for (const [stat, value] of Object.entries(baseStats)) {
    const growthRate = growthPattern[stat] || DEFAULT_GROWTH_RATE;
    stats[stat] = calculateNpcAttributeValue(value, growthRate, level);
  }

  return stats;
}

// Generar niveles para NPC con cualquier tipo de atributo
function generateNpcLevels(
  baseStats,
  growthPattern,
  maxLevel = DEFAULT_MAX_LEVEL,
) {
  const levels = {};

  for (let level = INITIAL_LEVEL; level <= maxLevel; level++) {
    levels[level] = generateNpcStatsForLevel(baseStats, growthPattern, level);
  }

  return levels;
}

// CONFIGURACIÓN DE ROLES

// Definición de stats base (nivel 1) y patrones de crecimiento por nivel para NPCs
const roleClassConfig = {
  merchant: {
    base: { sympathy: 5, negotiation: 8, intelligence: 6 },
    growth: { sympathy: 0.5, negotiation: 1, intelligence: 0.33 },
  },
  villager: {
    base: { sympathy: 6, negotiation: 5, intelligence: 5 },
    growth: { sympathy: 1, negotiation: 0.33, intelligence: 0.5 },
  },
  guard: {
    base: { sympathy: 3, defense: 8, intelligence: 5 },
    growth: { sympathy: 0.33, defense: 1, intelligence: 0.5 },
  },
  noble: {
    base: { sympathy: 7, negotiation: 6, intelligence: 7 },
    growth: { sympathy: 0.5, negotiation: 0.5, intelligence: 1 },
  },
  enemy: {
    base: { defense: 7, dexterity: 5, intelligence: 4 },
    growth: { defense: 1, dexterity: 0.5, intelligence: 0.33 },
  },
};

// GENERACIÓN DE ATRIBUTOS

// Generar el objeto de atributos completo para todos los roles de NPCs
const npcAttributes = {};

for (const [role, config] of Object.entries(roleClassConfig)) {
  npcAttributes[role] = generateNpcLevels(config.base, config.growth);
}

export default npcAttributes;
export { generateNpcLevels, roleClassConfig };
