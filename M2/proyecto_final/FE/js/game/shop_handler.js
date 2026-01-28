import { gameState } from "./game_state.js";
import { getPlayerCoins } from "./coins_handler.js";
import { removeCoins, createCoinsRecord } from "../api/coins_endpoints.js";
import { createItem, addItemToInventory } from "../api/inventory_endpoints.js";
import { loadAndRenderInventory } from "./inventory_handler.js";

// CONSTANTES
const INITIAL_COINS_AMOUNT = 0;
const DEFAULT_ITEM_QUANTITY = 1;

// Definición de items de la tienda
const SHOP_ITEMS = {
  espada_acero: {
    name: "Espada de Acero",
    description: "Una espada básica que aumenta tu daño en combate.",
    type: "Weapon",
    attributes: { combat_bonus: 1, decision_bonus: 0 },
    rarity: "Common",
    price: 100,
  },
  espada_reforzada: {
    name: "Espada Reforzada",
    description:
      "Una espada mejorada que aumenta tu daño y capacidad de decisión.",
    type: "Weapon",
    attributes: { combat_bonus: 2, decision_bonus: 1 },
    rarity: "Uncommon",
    price: 250,
  },
  espada_maestra: {
    name: "Espada Maestra",
    description:
      "Una espada excepcional que potencia significativamente tu combate y decisiones.",
    type: "Weapon",
    attributes: { combat_bonus: 3, decision_bonus: 2 },
    rarity: "Rare",
    price: 500,
  },
  amuleto_sabio: {
    name: "Amuleto Sabio",
    description:
      "Un amuleto místico que mejora tu capacidad para tomar decisiones.",
    type: "Accessory",
    attributes: { combat_bonus: 0, decision_bonus: 2 },
    rarity: "Uncommon",
    price: 200,
  },
  anillo_poder: {
    name: "Anillo de Poder",
    description: "Un anillo que potencia tu fuerza en combate.",
    type: "Accessory",
    attributes: { combat_bonus: 2, decision_bonus: 0 },
    rarity: "Uncommon",
    price: 200,
  },
};

// UTILIDADES PRIVADAS

// Obtener participante del jugador actual
function getPlayerParticipant() {
  return gameState.participants.find(
    (p) => p.user_id === gameState.userId && p.character_id,
  );
}

// Asegurar que el personaje tenga un monedero
async function ensureCoinsRecord(characterId) {
  let coins = await getPlayerCoins(characterId);

  if (coins === null) {
    console.log("Creando monedero para el personaje...");
    await createCoinsRecord({
      character_id: characterId,
      game_id: gameState.gameId,
      amount: INITIAL_COINS_AMOUNT,
    });
    coins = INITIAL_COINS_AMOUNT;
  }

  return coins;
}

// Parsear selección del item
function parseItemSelection(selectedValue) {
  const [itemKey, priceStr] = selectedValue.split("|");
  return {
    price: parseInt(priceStr),
    itemConfig: SHOP_ITEMS[itemKey],
  };
}

// Formatear mensaje de confirmación de compra
function formatPurchaseConfirmation(itemConfig, price) {
  return (
    `¿Deseas comprar ${itemConfig.name}?\n\n` +
    `Precio: ${price} monedas\n` +
    `${itemConfig.description}\n\n` +
    `Bonuses:\n` +
    `+${itemConfig.attributes.combat_bonus} Daño en Combate\n` +
    `+${itemConfig.attributes.decision_bonus} Bonus en Decisiones`
  );
}

// Formatear mensaje de éxito de compra
function formatSuccessMessage(itemConfig, newCoins) {
  return (
    `¡Compra exitosa!\n\n` +
    `${itemConfig.name}\n` +
    `+${itemConfig.attributes.combat_bonus} Daño en Combate\n` +
    `+${itemConfig.attributes.decision_bonus} Bonus en Decisiones\n\n` +
    `Monedas restantes: ${newCoins} 💰`
  );
}

// Formatear mensaje de fondos insuficientes
function formatInsufficientFundsMessage(price, currentCoins) {
  return `No tienes suficientes monedas.\nNecesitas: ${price} 💰\nTienes: ${currentCoins} 💰`;
}

// Actualizar display de monedas en el modal
function updateCoinsDisplay(coins) {
  const coinsDisplay = document.getElementById("player-coins");
  if (coinsDisplay) {
    coinsDisplay.textContent = coins;
  }
}

// Limpiar formulario de tienda
function clearShopForm() {
  const form = document.getElementById("shop-form");
  if (form) {
    form.reset();
  }
}

// Procesar compra de item
async function processPurchase(characterId, itemConfig, price) {
  // Crear el item en la base de datos
  const newItem = await createItem({
    name: itemConfig.name,
    description: itemConfig.description,
    type: itemConfig.type,
    attributes: JSON.stringify(itemConfig.attributes),
    rarity: itemConfig.rarity,
  });

  if (!newItem || !newItem.item_id) {
    throw new Error("Error al crear el item");
  }

  // Agregar el item al inventario
  await addItemToInventory({
    character_id: characterId,
    game_id: gameState.gameId,
    item_id: newItem.item_id,
    quantity: DEFAULT_ITEM_QUANTITY,
  });

  // Restar monedas
  await removeCoins(characterId, gameState.gameId, price);
}

// FUNCIONES PÚBLICAS

// Abrir modal de tienda
export async function openShopModal() {
  const modal = document.getElementById("shop-modal");
  const participant = getPlayerParticipant();

  if (!participant || !participant.character_id) {
    alert("No se encontró tu personaje.");
    return;
  }

  try {
    const coins = await ensureCoinsRecord(participant.character_id);
    updateCoinsDisplay(coins);
    modal.style.display = "flex";
  } catch (error) {
    console.error("Error al abrir tienda:", error);
    alert("Error al abrir la tienda.");
  }
}

// Cerrar modal de tienda
export function closeShopModal() {
  const modal = document.getElementById("shop-modal");
  modal.style.display = "none";
  clearShopForm();
}

// Manejar compra de item
export async function handlePurchaseItem(event) {
  event.preventDefault();

  const selectElement = document.getElementById("shop-item");
  const selectedValue = selectElement.value;

  if (!selectedValue) {
    alert("Por favor selecciona un item.");
    return;
  }

  const { price, itemConfig } = parseItemSelection(selectedValue);
  const participant = getPlayerParticipant();

  if (!participant || !participant.character_id) {
    alert("No se encontró tu personaje.");
    return;
  }

  try {
    const currentCoins = await getPlayerCoins(participant.character_id);

    // Verificar fondos suficientes
    if (currentCoins < price) {
      alert(formatInsufficientFundsMessage(price, currentCoins));
      return;
    }

    // Confirmar compra
    const confirmed = confirm(formatPurchaseConfirmation(itemConfig, price));
    if (!confirmed) {
      return;
    }

    // Procesar compra
    await processPurchase(participant.character_id, itemConfig, price);

    // Actualizar UI
    const newCoins = currentCoins - price;
    updateCoinsDisplay(newCoins);
    alert(formatSuccessMessage(itemConfig, newCoins));

    // Cerrar modal y recargar inventario
    closeShopModal();
    await loadAndRenderInventory();
  } catch (error) {
    console.error("Error al comprar item:", error);
    alert("Error al realizar la compra. Inténtalo de nuevo.");
  }
}

// Configurar event listeners de la tienda
export function setupShopListeners() {
  const btnOpenShop = document.getElementById("btn-open-shop");
  const modalClose = document.getElementById("shop-modal-close");
  const shopModal = document.getElementById("shop-modal");
  const shopForm = document.getElementById("shop-form");

  // Abrir tienda
  btnOpenShop?.addEventListener("click", openShopModal);

  // Cerrar modal con botón X
  modalClose?.addEventListener("click", closeShopModal);

  // Cerrar modal al hacer click fuera
  shopModal?.addEventListener("click", (e) => {
    if (e.target === shopModal) {
      closeShopModal();
    }
  });

  // Manejar compra
  shopForm?.addEventListener("submit", handlePurchaseItem);
}
