import { apiInstance } from "./api.js";

/**
 * Iniciar un combate con un NPC
 */
export const startCombat = async (gameId, npcId) => {
  try {
    const response = await apiInstance.post("/combat/start", {
      game_id: gameId,
      npc_id: npcId,
    });

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al iniciar combate:", error);
    throw error;
  }
};

/**
 * Registrar un ataque al NPC
 */
export const attackNpc = async (gameId, damage) => {
  try {
    const response = await apiInstance.post("/combat/attack", {
      game_id: gameId,
      damage: damage,
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al atacar NPC:", error);
    throw error;
  }
};

/**
 * Obtener el combate activo de un juego
 */
export const getActiveCombat = async (gameId) => {
  try {
    const response = await apiInstance.get(`/combat/${gameId}/active`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No hay combate activo
    }
    console.error("Error al obtener combate activo:", error);
    throw error;
  }
};
