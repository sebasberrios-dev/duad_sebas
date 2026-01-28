import { apiInstance } from "./api.js";

// INVENTARIOS API ENDPOINTS

export const getMyInventory = async (inventoryData) => {
  try {
    const queryParams = new URLSearchParams(inventoryData).toString();
    const response = await apiInstance.get(`/my_inventory?${queryParams}`);
    if (response.status === 400) {
      throw new Error("Faltan datos para obtener el inventario del usuario");
    } else if (response.status === 200) {
      return response.data.items || [];
    }
  } catch (error) {
    console.error("Error al obtener mi inventario:", error);
    throw error;
  }
};

export const createInventory = async (inventoryData) => {
  try {
    const response = await apiInstance.post("/inventoriy/new", inventoryData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para crear el inventario");
    } else if (response.status === 409) {
      throw new Error(
        "El usuario ya tiene un inventario asignado a este personaje",
      );
    } else if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el inventario:", error);
    throw error;
  }
};

export const deleteInventory = async (inventoryId) => {
  try {
    const response = await apiInstance.delete(`/inventory/${inventoryId}`);
    if (response.status !== 200) {
      throw new Error("Error al eliminar el inventario");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el inventario:", error);
    throw error;
  }
};

// CATALOGO DE ITEMS API ENDPOINTS

export const getItems = async () => {
  try {
    const response = await apiInstance.get("/items");
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al obtener los items:", error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await apiInstance.post("/items/new", itemData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para crear el item");
    } else if (response.status === 201) {
      console.log("Item creado:", response.data);
      return response.data;
    }
  } catch (error) {
    console.error("Error al crear el item:", error);
    throw error;
  }
};

export const updateItem = async (itemId, updatedData) => {
  try {
    const response = await apiInstance.put(`/items/${itemId}`, updatedData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para actualizar el item");
    } else if (response.status === 404) {
      throw new Error("Item no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al actualizar el item:", error);
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  try {
    const response = await apiInstance.delete(`/items/${itemId}`);
    if (response.status !== 200) {
      throw new Error("Error al eliminar el item");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el item:", error);
    throw error;
  }
};

// ITEMS EN INVENTARIO API ENDPOINTS

export const addQuantityOrItemToInventory = async (itemData) => {
  try {
    const response = await apiInstance.post("/inventory/add_item", itemData);
    if (response.status === 400) {
      throw new Error("Datos inválidos para agregar el item al inventario");
    } else if (response.status === 404) {
      throw new Error("Item no encontrado");
    } else if (response.status === 200 || response.status === 201) {
      return {
        data: response.data,
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error al agregar el item al inventario:", error);
    throw error;
  }
};

export const removeQuantityOrItemFromInventory = async (itemData) => {
  try {
    const response = await apiInstance.delete(
      "/inventory/remove_item",
      itemData,
    );
    if (response.status === 400) {
      throw new Error("Datos inválidos para eliminar el item del inventario");
    } else if (response.status === 404) {
      throw new Error("Item o inventario no encontrado");
    } else if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error al eliminar el item del inventario:", error);
    throw error;
  }
};
