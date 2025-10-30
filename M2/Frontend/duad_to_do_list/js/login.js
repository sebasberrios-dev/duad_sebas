const form = document.getElementById("login-form");

const login = async (userId, password) => {
  try {
    console.log("Logging in user...");
    const userData = {
      data: {
        userId: userId,
        password: password,
      },
    };
    const response = await create(userData);
    const users = await getStoredUsers();
    const user = await verifyUser(users, userId, password);
    if (user) {
      if (response) {
        console.log("User logged in successfully");
        alert("Inicio de sesión exitoso!");
        setAuthUser(user);
        return true;
      }
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    alert(`Error en el inicio de sesión: ${error.message}`);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userIdInput = document.getElementById("userId").value.trim();
  const passwordInput = document.getElementById("password").value.trim();
  if (!userIdInput || !passwordInput) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  if (await login(userIdInput, passwordInput)) {
    window.location.href = "/M2/Frontend/duad_to_do_list/todo.html";
  }
});
