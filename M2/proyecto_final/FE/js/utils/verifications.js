import { isAuthenticated } from "../storage/auth.js";

export const verifyAuth = () => {
  if (!isAuthenticated()) {
    alert("Por favor, inicie sesión para acceder a esta página.");
    window.location.href = "/M2/proyecto_final/FE/html/login.html";
    return false;
  } else {
    console.log("Usuario autenticado.");
    return true;
  }
};
