import { apiInstance } from "./api.js";

const getAllCharacters = async () => {
  try {
    const response = await apiInstance.get("/characters");
    if (response.status === 404) {
      throw new Error("No se encontraron personajes");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los personajes:", error);
    throw error;
  }
};

const getMyCharacters = async () => {
  try {
    const response = await apiInstance.get("/my_characters");
    if (response.status === 200) {
      if (response.data.characters !== undefined) {
        return response.data.characters;
      }
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los personajes del usuario:", error);
    throw error;
  }
};

const getCharacterById = async (characterId) => {
  try {
    const response = await apiInstance.get(`/characters/${characterId}`);
    if (response.status === 200) {
      if (response.data.character !== undefined) {
        return response.data.character;
      }
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener el personaje:", error);
    throw error;
  }
};

const createCharacter = async (characterData) => {
  try {
    const response = await apiInstance.post("/characters/new", characterData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para el personaje");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el personaje:", error);
    throw error;
  }
};

const updateCharacter = async (characterId, updatedData) => {
  try {
    const response = await apiInstance.put(
      `/characters/update/${characterId}`,
      updatedData,
    );
    if (response.status === 400) {
      throw new Error("Datos inválidos para actualizar el personaje");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el personaje:", error);
    throw error;
  }
};

const deleteCharacter = async (characterId) => {
  try {
    const response = await apiInstance.delete(
      `/characters/delete/${characterId}`,
    );
    if (response.status === 404) {
      throw new Error("Personaje no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el personaje:", error);
    throw error;
  }
};

const addXPToCharacter = async (characterId, xpAmount) => {
  try {
    const character = await getCharacterById(characterId);

    if (!character) {
      throw new Error("Personaje no encontrado");
    }

    const newXP = character.xp + xpAmount;
    const response = await updateCharacter(characterId, { xp: newXP });
    return response;
  } catch (error) {
    console.error("Error al agregar XP al personaje:", error);
    throw error;
  }
};

export {
  getAllCharacters,
  getMyCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  addXPToCharacter,
};
