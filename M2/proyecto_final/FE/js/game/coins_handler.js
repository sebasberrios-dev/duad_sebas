// MANEJO DE MONEDAS DEL JUGADOR

import { addCoins, getCharacterCoins } from "../api/coins_endpoints.js";
import { gameState } from "./game_state.js";

// Otorga monedas al personaje por ganar un combate
export async function awardCombatVictoryCoins(characterId) {
  const COMBAT_VICTORY_COINS = 50;

  try {
    const result = await addCoins(
      characterId,
      gameState.gameId,
      COMBAT_VICTORY_COINS,
    );

    return {
      coinsAdded: COMBAT_VICTORY_COINS,
      totalCoins: result.amount,
      message: `+${COMBAT_VICTORY_COINS} monedas por victoria`,
    };
  } catch (error) {
    console.error("Error al otorgar monedas por victoria:", error);
    throw error;
  }
}

// Otorga monedas al personaje por subir de nivel
export async function awardLevelUpCoins(characterId, newLevel) {
  const LEVEL_UP_COINS = 100;

  try {
    const result = await addCoins(
      characterId,
      gameState.gameId,
      LEVEL_UP_COINS,
    );

    return {
      coinsAdded: LEVEL_UP_COINS,
      totalCoins: result.amount,
      newLevel: newLevel,
      message: `+${LEVEL_UP_COINS} monedas por subir al nivel ${newLevel}`,
    };
  } catch (error) {
    console.error("Error al otorgar monedas por subir de nivel:", error);
    throw error;
  }
}

// Obtiene las monedas actuales del personaje
export async function getPlayerCoins(characterId) {
  try {
    const result = await getCharacterCoins(characterId, gameState.gameId);
    // Si coins_record es None, retornar null para indicar que no existe
    if (result.coins_record === null) {
      return null;
    }
    return result.amount || 0;
  } catch (error) {
    console.error("Error al obtener monedas del jugador:", error);
    throw error;
  }
}
