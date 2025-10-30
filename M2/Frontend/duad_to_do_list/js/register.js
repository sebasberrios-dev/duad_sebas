const form = document.getElementById("register-form");

const register = async (name, username, email, password) => {
  try {
    console.log("Registering user...");
    const userData = {
      name: name,
      data: {
        username: username,
        email: email,
        password: password,
      },
    };
    const response = await create(userData);
    if (response) {
      console.log("User registered successfully");
      setAuthUser(response);
      pushUser(response);
      alert(`Registro exitoso! Su ID de usuario es: ${response.id}`);
      return true;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    alert(`Error en el registro: ${error.message}`);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name").value.trim();
  const usernameInput = document.getElementById("username").value.trim();
  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value.trim();

  if (!nameInput || !usernameInput || !emailInput || !passwordInput) {
    alert("Por favor, complete todos los campos.");
    return;
  }
  if (await register(nameInput, usernameInput, emailInput, passwordInput)) {
    window.location.href = "/M2/Frontend/duad_to_do_list/todo.html";
  }
});
