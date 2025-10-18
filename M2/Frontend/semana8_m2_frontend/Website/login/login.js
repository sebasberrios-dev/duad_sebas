const userInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
  timeout: 3000,
});

const form = document.getElementById("login-form");

const loginUser = async (userId, password) => {
  try {
    console.log("Logging in user...");
    const userData = {
      data: {
        userId: userId,
        password: password,
      },
    };
    const response = await userInstance.post("", userData);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}.`);
    }
    const user = await userInstance.get(`/${userId}`);
    const storedUser = getAuthUser();
    const isValidUser = await verifyUser(storedUser, user, userId, password);
    if (isValidUser) {
      alert(`Inicio de sesión exitoso.`);
      window.location.href =
        "/M2/Frontend/semana8_m2_frontend/Website/my_profile/my_profile.html";
    } else {
      alert("ID de usuario o contraseña incorrectos.");
    }
  } catch (error) {
    console.log("Error logging in user:", error);
    alert(`Error logging in user: ${error.message}`);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userIdInput = document.getElementById("userId").value;
  const passwordInput = document.getElementById("password").value;

  if (!userIdInput || !passwordInput) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  loginUser(userIdInput, passwordInput);
});
