const userInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
  timeout: 3000,
});

const form = document.getElementById("register-form");

const registerUser = async (name, email, password, address) => {
  try {
    console.log("Registering user...");
    const userData = {
      name: name,
      data: {
        email: email,
        password: password,
        address: address,
      },
    };
    const response = await userInstance.post("", userData);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}.`);
    }
    setAuthUser(response.data);
    alert(
      `Usuario creado exitosamente. Su ID de registro es: ${response.data.id}`
    );
    return true;
  } catch (error) {
    console.log("Error Registering user:", error);
    alert(`Error registrando usuario: ${error.message}`);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("name").value;
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  const addressInput = document.getElementById("address").value;

  if (!nameInput || !emailInput || !passwordInput || !addressInput) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  if (await registerUser(nameInput, emailInput, passwordInput, addressInput)) {
    window.location.href =
      "/M2/Frontend/semana8_m2_frontend/Website/my_profile/my_profile.html";
  }
});
