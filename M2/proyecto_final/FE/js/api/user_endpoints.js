import { apiInstance } from "./api.js";

export const register = async (userData) => {
  try {
    const response = await apiInstance.post("/register", userData);
    if (response.status === 400) {
      throw new Error("Faltan campos obligatorios");
    } else if (response.status === 409) {
      throw new Error("El usuario ya existe");
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiInstance.post("/login", credentials);
    if (response.status === 400) {
      throw new Error("Faltan campos obligatorios");
    } else if (response.status === 401) {
      throw new Error("Credenciales inválidas");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await apiInstance.get("/me");
    if (response.status === 404) {
      throw new Error("Usuario no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await apiInstance.get("/users");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
};

export const updateUserProfile = async (updatedData) => {
  try {
    const response = await apiInstance.put("/me", updatedData);
    if (response.status === 403) {
      throw new Error("No autorizado para modificar este usuario");
    } else if (response.status === 400) {
      throw new Error("No hay datos para actualizar");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    throw error;
  }
};

export const deleteUserAccount = async (userId) => {
  try {
    const response = await apiInstance.delete(`/user/delete/${userId}`);
    if (response.status === 404) {
      throw new Error("Usuario no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar la cuenta del usuario:", error);
    throw error;
  }
};
