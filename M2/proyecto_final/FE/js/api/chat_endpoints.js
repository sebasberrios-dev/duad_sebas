import { apiInstance } from "./api.js";

export const getMyCMs = async () => {
  try {
    const response = await apiInstance.get("/my_chat_messages");
    if (response.status === 404) {
      throw new Error(
        "No se encontraron mensajes de chat para el usuario en este juego",
      );
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los mensajes de chat del usuario:", error);
    throw error;
  }
};

export const getGameCMs = async (gameId) => {
  try {
    const response = await apiInstance.get(`/game_chat_messages/${gameId}`);
    if (response.status === 404) {
      throw new Error("No se encontraron mensajes de chat para el juego");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error al obtener los mensajes de chat para el juego:",
      error,
    );
    throw error;
  }
};

export const createCM = async (messageData) => {
  try {
    const response = await apiInstance.post("/chat/new", messageData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para el mensaje de chat");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el mensaje de chat:", error);
    throw error;
  }
};

export const updateCM = async (messageId, updatedData) => {
  try {
    const response = await apiInstance.put(`/chat/${messageId}`, updatedData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para actualizar el mensaje de chat");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el mensaje de chat:", error);
    throw error;
  }
};

export const deleteCM = async (messageId) => {
  try {
    const response = await apiInstance.delete(`/chat/${messageId}`);
    if (response.status === 404) {
      throw new Error("Mensaje de chat no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el mensaje de chat:", error);
    throw error;
  }
};
