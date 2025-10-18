const logoutButton = document.getElementById("logout-button");
const changePassButton = document.getElementById("change-password");
const userData = getAuthUser();

const hidePassword = (password) => {
  if (password.length <= 2) return "*".repeat(password.length);
  return password.replace(/./g, "*");
};

const userDisplay = async () => {
  if (userData) {
    document.getElementById("user-id").innerText = userData.id;
    document.getElementById("user-name").innerText = userData.name;
    document.getElementById("user-email").innerText = userData.data.email;
    document.getElementById("user-address").innerText = userData.data.address;
    document.getElementById("user-password").innerText = hidePassword(
      userData.data.password
    );
  }
};

if (!isAuthenticated()) {
  alert("Debe iniciar sesión para acceder a esta sección.");
  window.location.href =
    "/M2/Frontend/semana8_m2_frontend/Website/login/login.html";
}

userDisplay();

logoutButton.addEventListener("click", () => {
  clearAuth();
  window.location.href =
    "/M2/Frontend/semana8_m2_frontend/Website/login/login.html";
});
