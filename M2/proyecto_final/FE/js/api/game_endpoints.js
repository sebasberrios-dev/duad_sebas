import { apiInstance } from "./api.js";

export const getAllGames = async () => {
  try {
    const response = await apiInstance.get("/games");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
    throw error;
  }
};

export const getGameById = async (gameId) => {
  try {
    const response = await apiInstance.get(`/games/${gameId}`);
    if (response.status === 404) {
      throw new Error("Juego no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener el juego:", error);
    throw error;
  }
};

export const getGameByLink = async (inviteLink) => {
  try {
    const response = await apiInstance.get(`/games/join/${inviteLink}`);
    if (response.status === 404) {
      return null;
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Si es 403 (partida inactiva), retornar null sin mostrar error
    if (error.response && error.response.status === 403) {
      return null;
    }
    console.error("Error al obtener el juego:", error);
    throw error;
  }
};

export const getMyGames = async () => {
  try {
    const response = await apiInstance.get("/my_games");
    if (response.status === 404) {
      throw new Error("No se encontraron juegos para el usuario");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los juegos del usuario:", error);
    throw error;
  }
};

export const createGame = async (gameData) => {
  try {
    const response = await apiInstance.post("/games/new", gameData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para crear el juego");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el juego:", error);
    throw error;
  }
};

export const updateGame = async (gameId, updatedData) => {
  try {
    const response = await apiInstance.put(`/games/${gameId}`, updatedData);
    if (response.status === 400) {
      throw new Error("Datos Inválidos para actualizar el juego");
    } else if (response.status === 404) {
      throw new Error("Juego no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el juego:", error);
    throw error;
  }
};

export const toogleGameStatus = async (gameId) => {
  try {
    const response = await apiInstance.patch(`/games/${gameId}/toggle-active`);
    if (response.status === 404) {
      throw new Error("Juego no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al cambiar el estado del juego:", error);
    throw error;
  }
};

export const deleteGame = async (gameId) => {
  try {
    const response = await apiInstance.delete(`/games/${gameId}`);
    if (response.status === 404) {
      throw new Error("Juego no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el juego:", error);
    throw error;
  }
};
