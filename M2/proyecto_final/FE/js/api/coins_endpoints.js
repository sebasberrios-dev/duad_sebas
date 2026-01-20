import { apiInstance } from "./api.js";

export const getAllCoins = async () => {
  try {
    const response = await apiInstance.get("/coins");
    if (response.status === 404) {
      throw new Error("No se encontraron monedas");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener las monedas:", error);
    throw error;
  }
};

export const getCharacterCoins = async (characterId, gameId) => {
  try {
    const response = await apiInstance.get(
      `/character/${characterId}/${gameId}/game_coins`,
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener las monedas del personaje:", error);
    throw error;
  }
};

export const createCoinsRecord = async (coinsData) => {
  try {
    const response = await apiInstance.post("/coins/new", coinsData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para las monedas");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el registro de monedas:", error);
    throw error;
  }
};

export const addCoins = async (characterId, gameId, amount) => {
  try {
    const response = await apiInstance.put(
      `/coins/add/${characterId}/${gameId}`,
      { amount: amount },
    );
    if (response.status === 201) {
      console.log("Monedero creado y monedas añadidas");
      return response.data;
    } else if (response.status === 200) {
      console.log("Monedas añadidas al monedero existente");
      return response.data;
    }
  } catch (error) {
    console.error("Error al añadir monedas:", error);
    throw error;
  }
};

export const removeCoins = async (characterId, gameId, amount) => {
  try {
    const response = await apiInstance.put(
      `/coins/remove/${characterId}/${gameId}`,
      { amount: amount },
    );
    if (response.status === 404) {
      throw new Error(
        "No se encontró monedero para el personaje en este juego",
      );
    } else if (response.status === 400) {
      throw new Error("Fondos insuficientes para reducir las monedas");
    } else if (response.status === 200) {
      console.log("Monedas retiradas del monedero");
      return response.data;
    }
  } catch (error) {
    console.error("Error al retirar monedas:", error);
    throw error;
  }
};
