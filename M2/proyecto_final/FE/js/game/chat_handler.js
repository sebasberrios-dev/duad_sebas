/**
 * MANEJO DE CHAT
 */

import { gameState } from "./game_state.js";
import { createCM, getGameCMs } from "../api/chat_endpoints.js";

/**
 * Envía mensaje de chat
 */
export const sendChatMessage = async () => {
  try {
    const chatInput = document.querySelector(".chat-input");
    const message = chatInput.value.trim();

    if (!message) {
      return;
    }

    const messageData = {
      game_id: gameState.gameId,
      message: message,
    };

    await createCM(messageData);
    chatInput.value = "";
    await loadChatMessages();
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    alert("Error al enviar el mensaje");
  }
};

/**
 * Carga los mensajes del chat
 */
export const loadChatMessages = async () => {
  try {
    const messages = await getGameCMs(gameState.gameId);
    const chatContainer = document.querySelector(".chat-messages");

    if (!chatContainer) return;

    chatContainer.innerHTML = "";

    messages.forEach((msg) => {
      const messageElement = createChatMessageElement(msg);
      chatContainer.appendChild(messageElement);
    });

    // Scroll al final
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error("Error al cargar mensajes del chat:", error);
  }
};

/**
 * Crea un elemento de mensaje de chat
 */
const createChatMessageElement = (message) => {
  const messageDiv = document.createElement("div");

  // Determinar si el mensaje es del DM
  const isDM = message.user_id === gameState.gameData?.user_id;
  messageDiv.className = isDM ? "chat-message dm-message" : "chat-message";

  messageDiv.innerHTML = `
    <span class="message-author">${message.username || "Usuario"}:</span>
    <span class="message-text">${message.message}</span>
  `;

  return messageDiv;
};
