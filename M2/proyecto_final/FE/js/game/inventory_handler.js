import { gameState } from "./game_state.js";
import { getMyInventory } from "../api/inventory_endpoints.js";

// UTILIDADES PRIVADAS

// Obtener participante del jugador actual
function getPlayerParticipant() {
  return gameState.participants.find(
    (p) => p.user_id === gameState.userId && p.character_id,
  );
}

// Obtener inventario del jugador actual
async function getPlayerInventory() {
  const participant = getPlayerParticipant();

  if (!participant || !participant.character_id) {
    return [];
  }

  try {
    const inventoryData = {
      character_id: participant.character_id,
      game_id: gameState.gameId,
    };
    return await getMyInventory(inventoryData);
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    return [];
  }
}

// Parsear atributos de un item (puede ser string JSON u objeto)
function parseItemAttributes(attributes) {
  try {
    return typeof attributes === "string" ? JSON.parse(attributes) : attributes;
  } catch (e) {
    console.error("Error parsing item attributes:", e);
    return {};
  }
}

// Calcular bonus total de un atributo específico del inventario
async function getInventoryBonus(attributeName) {
  const inventory = await getPlayerInventory();

  if (!inventory || inventory.length === 0) {
    return 0;
  }

  let totalBonus = 0;
  inventory.forEach((item) => {
    if (item.attributes) {
      const attrs = parseItemAttributes(item.attributes);
      const bonus = attrs[attributeName] || 0;
      totalBonus += bonus * (item.quantity || 1);
    }
  });

  return totalBonus;
}

// Crear elemento HTML para un item del inventario
function createInventoryItemElement(item) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "inventory-item";

  const itemName = document.createElement("span");
  itemName.className = "item-name";
  itemName.textContent = item.name || "Item sin nombre";

  const itemQuantity = document.createElement("span");
  itemQuantity.className = "item-quantity";
  itemQuantity.textContent = `x${item.quantity || 1}`;

  itemDiv.appendChild(itemName);
  itemDiv.appendChild(itemQuantity);

  return itemDiv;
}

// FUNCIONES PÚBLICAS

// Cargar y renderizar inventario del jugador
export async function loadAndRenderInventory() {
  const inventoryGrid = document.querySelector(".inventory-grid");

  if (!inventoryGrid) {
    console.error("No se encontró el contenedor del inventario");
    return;
  }

  const participant = getPlayerParticipant();

  if (!participant) {
    inventoryGrid.innerHTML =
      '<p style="color: rgba(255,255,255,0.5); text-align: center;">No tienes un personaje asignado.</p>';
    return;
  }

  const inventory = await getPlayerInventory();

  // Limpiar inventario actual
  inventoryGrid.innerHTML = "";

  // Si no hay items
  if (inventory.length === 0) {
    inventoryGrid.innerHTML =
      '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 1rem;">Tu inventario está vacío.</p>';
    return;
  }

  // Renderizar cada item
  inventory.forEach((item) => {
    const itemElement = createInventoryItemElement(item);
    inventoryGrid.appendChild(itemElement);
  });
}

// Obtener bonus total de combate del inventario
export async function getCombatBonus() {
  return await getInventoryBonus("combat_bonus");
}

// Obtener bonus total de decisión del inventario
export async function getDecisionBonus() {
  return await getInventoryBonus("decision_bonus");
}
