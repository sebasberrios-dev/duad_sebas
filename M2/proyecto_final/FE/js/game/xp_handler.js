import { grantXP, updateXPBar } from "../logic/xp_system.js";

// Otorga XP a un personaje y actualiza la barra de XP
export async function awardXP(characterId, xpAmount) {
  try {
    const result = await grantXP(characterId, xpAmount);
    updateXPBar(result.currentXP, result.currentLevel);
    return result;
  } catch (error) {
    console.error("Error al otorgar XP:", error);
    throw error;
  }
}
