// MANEJO DE RECOMPENSAS DE COMBATE

import { awardXP } from "./xp_handler.js";
import { awardCombatVictoryCoins, awardLevelUpCoins } from "./coins_handler.js";
import {
  calculateXpGained,
  formatLevelUpMessage,
  formatMaxLevelMessage,
  formatVictoryMessage,
} from "./combat_utils.js";

// Manejar victoria en combate: otorgar XP y monedas
export const handleCombatVictory = async (
  characterId,
  npcMaxHp,
  username,
  session,
  loadNarrative,
) => {
  const xpGained = calculateXpGained(npcMaxHp);

  try {
    // Otorgar monedas por victoria
    let coinsResult;
    try {
      coinsResult = await awardCombatVictoryCoins(characterId);
    } catch (coinsError) {
      console.error("Error al otorgar monedas:", coinsError);
    }

    const xpResult = await awardXP(characterId, xpGained);

    if (xpResult.leveledUp) {
      const stats = xpResult.statsGained;

      // Otorgar monedas adicionales por subir de nivel
      let levelUpCoins;
      try {
        levelUpCoins = await awardLevelUpCoins(characterId, xpResult.newLevel);
      } catch (coinsError) {
        console.error("Error al otorgar monedas por nivel:", coinsError);
      }

      await session.addPublicNote(
        `[NARRATIVA]¡${username} ha derrotado al NPC! Ganó ${xpGained} XP y subió al nivel ${xpResult.newLevel}! (+${stats.strength} FUE, +${stats.dexterity} DES, +${stats.intelligence} INT)`,
      );
      await loadNarrative();

      const message = formatLevelUpMessage(
        xpGained,
        xpResult.newLevel,
        stats,
        coinsResult,
        levelUpCoins,
      );
      alert(message);
    } else if (xpResult.maxLevel) {
      await session.addPublicNote(
        `[NARRATIVA]¡${username} ha derrotado al NPC! Ya alcanzó el nivel máximo.`,
      );
      await loadNarrative();

      const message = formatMaxLevelMessage(coinsResult);
      alert(message);
    } else {
      await session.addPublicNote(
        `[NARRATIVA]¡${username} ha derrotado al NPC! Ganó ${xpGained} XP (${xpResult.currentXP}/${xpResult.xpNeeded})`,
      );
      await loadNarrative();

      const message = formatVictoryMessage(xpGained, xpResult, coinsResult);
      alert(message);
    }
  } catch (error) {
    console.error("Error otorgando XP:", error);
    await session.addPublicNote(
      `[NARRATIVA]¡${username} ha derrotado al NPC en combate! La partida puede continuar.`,
    );
    await loadNarrative();
    alert("¡Has derrotado al NPC! La partida continúa.");
  }
};

// Manejar derrota en combate (sin tiradas restantes)
export const handleCombatDefeat = async (username, session, loadNarrative) => {
  await session.addPublicNote(
    `[NARRATIVA]${username} no logró derrotar al NPC a tiempo. La partida ha terminado.`,
  );
  await loadNarrative();

  setTimeout(() => {
    alert("Se agotaron las tiradas. ¡La partida ha terminado!");
    window.location.href = "/M2/proyecto_final/FE/html/my_games.html";
  }, 500);
};
