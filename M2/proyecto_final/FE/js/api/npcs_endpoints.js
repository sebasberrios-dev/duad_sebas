import { apiInstance } from "./api.js";

const getGameNpcs = async (gameId) => {
  try {
    const response = await apiInstance.get(`/game/${gameId}/npcs`);
    if (response.status === 404) {
      throw new Error("No se encontraron NPCs para este juego");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los NPCs del juego:", error);
    throw error;
  }
};

const getAllNpcs = async () => {
  try {
    const response = await apiInstance.get("/npcs");
    if (response.status === 404) {
      throw new Error("No se encontraron NPCs");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los NPCs:", error);
    throw error;
  }
};

const getNpcsById = async (npcId) => {
  try {
    const response = await apiInstance.get(`/npcs/${npcId}`);
    if (response.status === 404) {
      throw new Error("NPC no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener el NPC por ID:", error);
    throw error;
  }
};

const createNpc = async (npcData) => {
  try {
    const response = await apiInstance.post("/npcs/new", npcData);
    if (response.status === 404) {
      throw new Error("Juego no encontrado para asignar el NPC");
    } else if (response.status === 400) {
      throw new Error("Datos inválidos para crear el NPC");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el NPC:", error);
    throw error;
  }
};

const updateNpc = async (npcId, updatedData) => {
  try {
    const response = await apiInstance.put(`/npcs/${npcId}`, updatedData);
    if (response.status === 404) {
      throw new Error("NPC no encontrado");
    } else if (response.status === 400) {
      throw new Error("Datos inválidos para actualizar el NPC");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el NPC:", error);
    throw error;
  }
};

const deleteNpc = async (npcId) => {
  try {
    const response = await apiInstance.delete(`/npcs/${npcId}`);
    if (response.status === 404) {
      throw new Error("NPC no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el NPC:", error);
    throw error;
  }
};

export {
  getGameNpcs,
  getAllNpcs,
  getNpcsById,
  createNpc,
  updateNpc,
  deleteNpc,
};
