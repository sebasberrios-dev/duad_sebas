/**
 * ESTADO GLOBAL DE LA PARTIDA
 */

export const gameState = {
  gameId: null,
  participantId: null,
  userId: null,
  isUserDM: false,
  session: null,
  participants: [],
  playerCharacterId: null,
  gameData: null,
  lastDifficulty: null, // Última tirada de dificultad del DM
  activeNpcCombat: null, // NPC contra el que se está combatiendo
};
