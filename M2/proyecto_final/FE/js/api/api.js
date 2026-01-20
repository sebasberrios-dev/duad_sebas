import { getAuthUser } from "../storage/auth.js";

const apiInstance = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Rutas públicas que no requieren token
const publicRoutes = ["/register", "/login"];

apiInstance.interceptors.request.use(
  (config) => {
    // Verificar si la ruta es pública
    const isPublicRoute = publicRoutes.some((route) =>
      config.url.includes(route)
    );

    // Si es ruta pública, no verificar token
    if (isPublicRoute) {
      return config;
    }

    // Para rutas protegidas, verificar token
    const user = getAuthUser();
    const token = user ? user.token : null;

    if (!token) {
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/M2/proyecto_final/FE/html/login.html";
      return Promise.reject(new Error("No hay token de autenticación"));
    }

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      window.location.href = "/M2/proyecto_final/FE/html/login.html";
    } else if (error.response && error.response.status === 403) {
      // No mostrar alerta si es un error de "partida no activa"
      const errorMessage =
        error.response.data.error || error.response.data.message;
      if (errorMessage !== "This game is no longer active") {
        alert(`No tienes permiso para realizar esta acción: ${errorMessage}`);
      }
    }

    return Promise.reject(error);
  }
);

export { apiInstance };
