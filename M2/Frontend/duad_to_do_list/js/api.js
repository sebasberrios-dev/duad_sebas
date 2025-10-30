// El api no retorna los datos correctamente, se simula con axios y un baseURL

const apiInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 3000,
});

const get = async () => {
  try {
    const response = await apiInstance.get();
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching elements:", error);
    throw error;
  }
};

const create = async (element) => {
  try {
    const response = await apiInstance.post("", element);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Element created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating element:", error);
    throw error;
  }
};
