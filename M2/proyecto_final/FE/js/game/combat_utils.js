// UTILIDADES DE COMBATE

// Calcular defensa del NPC basado en HP máximo
export const calculateNpcDefense = (npcMaxHp) => {
  const estimatedLevel = Math.floor((npcMaxHp - 5) / 10);
  return 10 + estimatedLevel;
};

// Calcular XP ganado basado en HP del NPC
export const calculateXpGained = (npcMaxHp) => {
  const estimatedLevel = Math.floor((npcMaxHp - 5) / 10);
  return estimatedLevel * 50;
};

// Formatear mensaje de resultado de ataque exitoso
export const formatHitMessage = (
  attackRoll,
  npcDefense,
  totalDamage,
  damageRoll,
  combatBonus,
  newHP,
  maxHP,
  currentRolls,
  maxRolls,
) => {
  const bonusText =
    combatBonus > 0 ? ` (${damageRoll}+${combatBonus} bonus)` : "";
  return `✓ IMPACTO\nAtaque: ${attackRoll} vs Defensa: ${npcDefense}\nDaño: ${totalDamage}${bonusText}\nHP del NPC: ${newHP}/${maxHP}\nTiradas: ${currentRolls}/${maxRolls}`;
};

// Formatear mensaje de resultado de ataque fallido
export const formatMissMessage = (
  attackRoll,
  npcDefense,
  currentHP,
  maxHP,
  currentRolls,
  maxRolls,
) => {
  return `✗ FALLO\nAtaque: ${attackRoll} vs Defensa: ${npcDefense}\nHP del NPC: ${currentHP}/${maxHP}\nTiradas: ${currentRolls}/${maxRolls}`;
};

// Formatear mensaje de victoria con level up
export const formatLevelUpMessage = (
  xpGained,
  newLevel,
  stats,
  coinsResult,
  levelUpCoins,
) => {
  const coinsMsg = coinsResult
    ? `\n\n💰 +${coinsResult.coinsAdded} monedas (victoria)`
    : "";
  const levelCoinsMsg = levelUpCoins
    ? `\n💰 +${levelUpCoins.coinsAdded} monedas (nivel)`
    : "";
  const totalCoinsMsg = levelUpCoins
    ? `\nTotal: ${levelUpCoins.totalCoins} monedas`
    : coinsResult
      ? `\nTotal: ${coinsResult.totalCoins} monedas`
      : "";

  return `¡Has derrotado al NPC!\n+${xpGained} XP\n\n¡SUBISTE AL NIVEL ${newLevel}!\n+${stats.strength} Fuerza\n+${stats.dexterity} Destreza\n+${stats.intelligence} Inteligencia${coinsMsg}${levelCoinsMsg}${totalCoinsMsg}`;
};

// Formatear mensaje de victoria en nivel máximo
export const formatMaxLevelMessage = (coinsResult) => {
  const coinsMsg = coinsResult
    ? `\n\n💰 +${coinsResult.coinsAdded} monedas\nTotal: ${coinsResult.totalCoins} monedas`
    : "";
  return `¡Has derrotado al NPC!\nYa alcanzaste el nivel máximo (7)${coinsMsg}`;
};

// Formatear mensaje de victoria sin level up
export const formatVictoryMessage = (xpGained, xpResult, coinsResult) => {
  const coinsMsg = coinsResult
    ? `\n\n💰 +${coinsResult.coinsAdded} monedas\nTotal: ${coinsResult.totalCoins} monedas`
    : "";
  return `¡Has derrotado al NPC!\n+${xpGained} XP\n${xpResult.currentXP}/${xpResult.xpNeeded} XP (Faltan ${xpResult.xpRemaining} para nivel ${xpResult.currentLevel + 1})${coinsMsg}`;
};
