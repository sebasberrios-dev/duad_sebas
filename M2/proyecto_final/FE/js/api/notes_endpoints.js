import { apiInstance } from "./api.js";

const getAllNotes = async () => {
  try {
    const response = await apiInstance.get("/notes");
    if (response.status === 404) {
      throw new Error("No se encontraron notas");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener las notas:", error);
    throw error;
  }
};

const getMyNotes = async () => {
  try {
    const response = await apiInstance.get("/my_notes");
    if (response.status === 200) {
      return response.data;
    }
    if (response.data && response.data.length === 0) {
      throw new Error("No se encontraron notas para el usuario");
    }
  } catch (error) {
    console.error("Error al obtener mis notas:", error);
    throw error;
  }
};

const getGameNotes = async (gameId) => {
  try {
    const response = await apiInstance.get(`/game/${gameId}/notes`);
    if (response.status === 200) {
      // El backend devuelve {notes: [...]}, extraer el array
      return response.data.notes || [];
    }
  } catch (error) {
    console.error("Error al obtener las notas del juego:", error);
    throw error;
  }
};

const createNote = async (noteData) => {
  try {
    const response = await apiInstance.post("/notes/new", noteData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para crear la nota");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear la nota:", error);
    throw error;
  }
};

const updateNote = async (noteId, updatedData) => {
  try {
    const response = await apiInstance.put(`/notes/${noteId}`, updatedData);
    if (response.status === 404) {
      throw new Error("Nota no encontrada");
    } else if (response.status === 400) {
      throw new Error("Datos inválidos para actualizar la nota");
    }
  } catch (error) {
    console.error("Error al actualizar la nota:", error);
    throw error;
  }
};

const deleteNote = async (noteId) => {
  try {
    const response = await apiInstance.delete(`/notes/${noteId}`);
    if (response.status === 404) {
      throw new Error("Nota no encontrada");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar la nota:", error);
    throw error;
  }
};

export {
  getAllNotes,
  getMyNotes,
  getGameNotes,
  createNote,
  updateNote,
  deleteNote,
};
