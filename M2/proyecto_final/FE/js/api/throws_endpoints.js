import { apiInstance } from "./api.js";

export const getGameDTs = async (gameId) => {
  try {
    const response = await apiInstance.get(`/game/${gameId}/throws`);
    if (response.status === 400) {
      throw new Error(
        "Error al obtener los lanzamientos de dados para el juego",
      );
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error al obtener los lanzamientos de dados para el juego:",
      error,
    );
    throw error;
  }
};

export const getPlayerDTs = async () => {
  try {
    const response = await apiInstance.get("/my_throws");
    if (response.status === 404) {
      throw new Error(
        "No se encontraron lanzamientos de dados para el usuario en este juego",
      );
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error al obtener los lanzamientos de dados del usuario:",
      error,
    );
    throw error;
  }
};

export const getDMDTs = async () => {
  try {
    const response = await apiInstance.get("/dm_throws");
    if (response.status === 404) {
      throw new Error(
        "No se encontraron lanzamientos de dados para el DM en este juego",
      );
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error al obtener los lanzamientos de dados para el DM:",
      error,
    );
    throw error;
  }
};

export const createDT = async (dtData) => {
  try {
    const response = await apiInstance.post("/throws/new", dtData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para el lanzamiento de dados");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el lanzamiento de dados:", error);
    throw error;
  }
};

export const updateDT = async (dtId, dtData) => {
  try {
    const response = await apiInstance.put(`/throws/${dtId}`, dtData);
    if (response.status === 400) {
      throw new Error(
        "Datos inválidos para actualizar el lanzamiento de dados",
      );
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el lanzamiento de dados:", error);
    throw error;
  }
};

export const deleteDT = async (dtId) => {
  try {
    const response = await apiInstance.delete(`/throws/${dtId}`);
    if (response.status === 400) {
      throw new Error("Error al eliminar el lanzamiento de dados");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el lanzamiento de dados:", error);
    throw error;
  }
};
