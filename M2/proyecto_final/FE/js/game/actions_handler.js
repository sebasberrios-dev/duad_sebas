/**
 * MANEJO DE ACCIONES DE JUGADOR Y DM
 */

import { gameState } from "./game_state.js";
import { GameSession } from "../logic/game_flow.js";
import { loadNarrative } from "./narrative_handler.js";
import { getAuthUser } from "../storage/auth.js";
import { toogleGameStatus } from "../api/game_endpoints.js";
import {
  startCombat,
  attackNpc,
  getActiveCombat,
} from "../api/combat_endpoints.js";
import { getCombatBonus, getDecisionBonus } from "./inventory_handler.js";
import { createDT } from "../api/throws_endpoints.js";
import {
  calculateNpcDefense,
  formatHitMessage,
  formatMissMessage,
} from "./combat_utils.js";
import { handleCombatVictory, handleCombatDefeat } from "./combat_rewards.js";

/**
 * Jugador tira dado para decisión
 */
export const playerRollDecision = async () => {
  try {
    if (!gameState.session) {
      gameState.session = new GameSession(
        gameState.gameId,
        gameState.participantId,
      );
    }

    const decision = document.getElementById("player-decision").value.trim();

    if (!decision) {
      alert("Describe tu acción primero");
      return;
    }

    // Tirar dado base
    const baseRoll = Math.floor(Math.random() * 20) + 1;

    // Obtener bonus de decisión del inventario
    const decisionBonus = await getDecisionBonus();
    const totalDecision = baseRoll + decisionBonus;

    // Crear el throw con el valor total (incluyendo bonus)
    await createDT({
      game_id: gameState.gameId,
      participant_id: gameState.participantId,
      dart_type: "d20",
      visible_to_dm: true,
      visible_to_players: true,
      throw_value: totalDecision,
    });

    const resultValue = document.querySelector("#player-actions .result-value");
    if (decisionBonus > 0) {
      resultValue.textContent = `${totalDecision} (${baseRoll}+${decisionBonus})`;
    } else {
      resultValue.textContent = baseRoll;
    }
    resultValue.style.color = "#3498db"; // Azul neutral

    const user = getAuthUser();
    await gameState.session.addPublicNote(
      `${user.username} intenta: ${decision} (Tirada: ${totalDecision}${decisionBonus > 0 ? ` [${baseRoll}+${decisionBonus}]` : ""})`,
    );

    await loadNarrative();
    alert(
      `Tirada realizada: ${totalDecision}${decisionBonus > 0 ? ` (${baseRoll}+${decisionBonus} bonus)` : ""}. Esperando decisión del DM...`,
    );
  } catch (error) {
    console.error("Error al tirar dado:", error);
    alert("Error al tirar dado");
  }
};

/**
 * DM tira dado de dificultad y compara con la última tirada del jugador
 */
export const dmRollDifficulty = async () => {
  try {
    if (!gameState.session) {
      gameState.session = new GameSession(
        gameState.gameId,
        gameState.participantId,
      );
    }

    // Obtener la última tirada visible de un jugador
    const throwsResponse = await gameState.session.getThrows();
    const playerThrows = throwsResponse.throws.filter(
      (t) => t.visible_to_players === true,
    );

    if (playerThrows.length === 0) {
      alert("No hay tiradas de jugadores para evaluar");
      return;
    }

    // Obtener la última tirada del jugador (ahora incluye el bonus)
    const lastPlayerThrow = playerThrows[playerThrows.length - 1];
    const playerRoll = lastPlayerThrow.throw_value;

    // Tirar dado de dificultad
    const result = await gameState.session.throwDart("d20", false);
    const difficulty = result.throwValue;

    const resultValue = document.querySelector("#dm-actions .result-value");
    resultValue.textContent = difficulty;

    // Comparar
    const success = playerRoll >= difficulty;
    const resultText = success
      ? `✓ ÉXITO (${playerRoll} vs ${difficulty})`
      : `✗ FALLO (${playerRoll} vs ${difficulty})`;

    await gameState.session.addPublicNote(
      `[DM] Resultado de la prueba: ${resultText}`,
    );

    await loadNarrative();

    if (success) {
      alert(
        `¡ÉXITO! El jugador superó la dificultad (${playerRoll} vs ${difficulty})`,
      );
    } else {
      const confirmed = confirm(
        `FALLO: El jugador no superó la dificultad (${playerRoll} vs ${difficulty}).\n\n¿Terminar la partida?`,
      );
      if (confirmed) {
        await gameState.session.addPublicNote(
          `[DM] ¡GAME OVER! La partida ha terminado.`,
        );

        // Terminar la partida en el backend
        await toogleGameStatus(gameState.gameId);

        setTimeout(() => {
          alert(
            "La partida ha terminado. Todos los jugadores serán redirigidos.",
          );
          window.location.href = "/M2/proyecto_final/FE/html/my_games.html";
        }, 500);
      }
    }
  } catch (error) {
    console.error("Error al tirar dado DM:", error);
    alert("Error al tirar dado");
  }
};

/**
 * Jugador ataca
 */
export const playerAttack = async () => {
  try {
    if (!gameState.session) {
      gameState.session = new GameSession(
        gameState.gameId,
        gameState.participantId,
      );
    }

    const attackType = document.querySelector(".attack-select").value;

    if (!attackType) {
      alert("Selecciona un tipo de ataque");
      return;
    }

    // Obtener combate activo desde el backend
    const combat = await getActiveCombat(gameState.gameId);

    if (!combat) {
      alert("El DM debe iniciar un combate primero");
      return;
    }

    // Verificar si el NPC ya fue derrotado
    if (combat.npc_current_hp <= 0) {
      alert(
        "El NPC ya ha sido derrotado. El DM debe iniciar un nuevo combate.",
      );
      return;
    }

    // Verificar si se alcanzó el límite de tiradas
    if (combat.current_rolls >= combat.max_rolls) {
      alert("Se alcanzó el límite de tiradas. ¡La partida ha terminado!");
      return;
    }

    // Realizar ataque
    const attackData = await performAttack(combat);

    // Mostrar resultado del ataque
    await displayAttackResult(attackData);

    // Procesar resultado del combate
    await processCombatResult(
      attackData.result,
      combat,
      attackData.user,
      attackData,
    );
  } catch (error) {
    console.error("Error al atacar:", error);
    alert("Error al atacar");
  }
};

/**
 * Realizar tiradas de ataque y calcular resultado
 */
const performAttack = async (combat) => {
  // DEBUG: Tiradas forzadas para ganar siempre
  const attackRoll = await gameState.session.throwDart("d20", true);
  const damageRoll = await gameState.session.throwDart("d12", true);

  // Forzar valores altos para debug
  const debugAttackRoll = 20; // Siempre crítico
  const debugDamageRoll = 12; // Máximo daño

  // Obtener bonus de combate del inventario
  const combatBonus = await getCombatBonus();
  const totalDamage = debugDamageRoll + combatBonus;

  // Calcular defensa del NPC
  const npcDefense = calculateNpcDefense(combat.npc_max_hp);

  // DEBUG: Siempre impacta
  const hit = true;

  // Calcular daño real (DEBUG: siempre hace daño)
  const damage = totalDamage;

  const user = getAuthUser();

  // Registrar ataque en el backend
  const result = await attackNpc(gameState.gameId, damage);

  console.log("DEBUG COMBAT:", {
    attackRoll: debugAttackRoll,
    damageRoll: debugDamageRoll,
    combatBonus,
    totalDamage,
    npcDefense,
    hit,
    damage,
    npcCurrentHP: result.npc_current_hp,
    npcMaxHP: result.npc_max_hp,
    result: result.result,
  });

  return {
    hit,
    totalDamage,
    attackRoll: debugAttackRoll,
    damageRoll: debugDamageRoll,
    combatBonus,
    npcDefense,
    result,
    user,
  };
};

/**
 * Mostrar resultado del ataque en la UI
 */
const displayAttackResult = async (attackData) => {
  const resultValue = document.querySelector(".combat-result .result-value");

  if (attackData.combatBonus > 0) {
    resultValue.textContent = `Ataque: ${attackData.attackRoll} | Daño: ${attackData.totalDamage} (${attackData.damageRoll}+${attackData.combatBonus})`;
  } else {
    resultValue.textContent = `Ataque: ${attackData.attackRoll} | Daño: ${attackData.damageRoll}`;
  }

  resultValue.style.color = attackData.hit ? "#2ecc71" : "#e74c3c";
};

/**
 * Procesar resultado del combate (victoria/derrota/continuar)
 */
const processCombatResult = async (result, combat, user, attackData) => {
  if (result.result === "victory") {
    await handleVictory(result, combat, user);
  } else if (result.result === "defeat") {
    await handleCombatDefeat(user.username, gameState.session, loadNarrative);
  } else {
    await showAttackOutcome(result, combat, attackData);
  }
};

/**
 * Manejar victoria en combate
 */
const handleVictory = async (result, combat, user) => {
  const participant = gameState.participants.find(
    (p) => p.user_id === gameState.userId,
  );

  if (participant && participant.character_id) {
    await handleCombatVictory(
      participant.character_id,
      combat.npc_max_hp,
      user.username,
      gameState.session,
      loadNarrative,
    );
  } else {
    await gameState.session.addPublicNote(
      `[NARRATIVA]¡${user.username} ha derrotado al NPC en combate! La partida puede continuar.`,
    );
    await loadNarrative();
    alert("¡Has derrotado al NPC! La partida continúa.");
  }
};

/**
 * Mostrar resultado de ataque (impacto/fallo) cuando el combate continúa
 */
const showAttackOutcome = async (result, combat, attackData) => {
  const hit = attackData.hit;

  if (hit) {
    const message = formatHitMessage(
      attackData.attackRoll,
      attackData.npcDefense,
      attackData.totalDamage,
      attackData.damageRoll,
      attackData.combatBonus,
      result.npc_current_hp,
      result.npc_max_hp,
      result.current_rolls,
      result.max_rolls,
    );
    alert(message);
  } else {
    const message = formatMissMessage(
      attackData.attackRoll,
      attackData.npcDefense,
      result.npc_current_hp,
      result.npc_max_hp,
      result.current_rolls,
      result.max_rolls,
    );
    alert(message);
  }

  // Verificar si se agotaron las tiradas después de mostrar el resultado
  if (result.result === "defeat") {
    const user = getAuthUser();
    await handleCombatDefeat(user.username, gameState.session, loadNarrative);
  }
};

/**
 * DM asigna combate
 */
export const assignCombat = async () => {
  try {
    if (!gameState.session) {
      gameState.session = new GameSession(
        gameState.gameId,
        gameState.participantId,
      );
    }

    const npcSelect = document.querySelector(".npc-select");
    const npcId = npcSelect.value;

    if (!npcId) {
      alert("Selecciona un NPC primero");
      return;
    }

    // Iniciar combate en el backend
    const combatData = await startCombat(gameState.gameId, parseInt(npcId));

    if (!combatData) {
      alert("Error al iniciar combate");
      return;
    }

    // Calcular defensa (10 + nivel)
    const defense = 10 + combatData.npc_level;

    alert(
      `Combate iniciado contra ${combatData.npc_name}\nNivel: ${combatData.npc_level}\nDefensa: ${defense}\nHP: ${combatData.npc_hp}\nTiradas máximas: ${combatData.max_rolls}\n\nLos jugadores pueden atacar.`,
    );
  } catch (error) {
    console.error("Error al asignar combate:", error);
    alert("Error al asignar combate");
  }
};
