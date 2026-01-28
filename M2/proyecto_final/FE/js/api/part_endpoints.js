import { apiInstance } from "./api.js";

export const getUserParticipations = async () => {
  try {
    const response = await apiInstance.get("/my_participations");
    if (response.status === 404) {
      throw new Error("No se encontraron participaciones para el usuario");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener las participaciones del usuario:", error);
    throw error;
  }
};

export const getGameParticipants = async (gameId) => {
  try {
    const response = await apiInstance.get(`/game/${gameId}/participants`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los participantes del juego:", error);
    throw error;
  }
};

export const createParticipation = async (participationData) => {
  try {
    const response = await apiInstance.post(
      "/participants/new",
      participationData,
    );
    if (response.status === 409) {
      throw new Error("El usuario ya está participando en este juego");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear la participación:", error);
    throw error;
  }
};

export const createParticipationToOwner = async (participationData) => {
  try {
    const response = await apiInstance.post(
      "/participants/new_owner",
      participationData,
    );
    if (response.status === 409) {
      throw new Error("El usuario ya es el propietario de este juego");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear la participación como propietario:", error);
    throw error;
  }
};

export const updateParticipation = async (participationId, updatedData) => {
  try {
    const response = await apiInstance.put(
      `/participants/${participationId}`,
      updatedData,
    );
    if (response.status === 400) {
      throw new Error("Datos inválidos para actualizar el participante");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el participante:", error);
    throw error;
  }
};

export const deleteParticipation = async (participationId) => {
  try {
    const response = await apiInstance.delete(
      `/participants/${participationId}`,
    );
    if (response.status === 404) {
      throw new Error("Participante no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar la participación:", error);
    throw error;
  }
};
