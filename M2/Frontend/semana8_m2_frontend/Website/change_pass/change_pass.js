const api = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
  timeout: 3000,
});

const userStorage = getAuthUser();

const form = document.getElementById("change-form");

const changePassword = async (userId, currentPass, newPass, passConfirm) => {
  try {
    const response = await api.get(`/${userId}`);
    if (response.status !== 200) {
      throw new Error(`User ${userId} not found.`);
    }
    const userPass = response.data.data.password;
    if (userPass !== currentPass) {
      alert("La contraseña actual es incorrecta.");
      return;
    }
    if (newPass !== passConfirm) {
      alert("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    const updatedData = {
      ...response.data,
      data: {
        ...response.data.data,
        password: newPass,
      },
    };
    await api.put(`/${userId}`, updatedData);
    alert("Contraseña cambiada con éxito.");
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    alert("Error al cambiar la contraseña.");
  }
};

const storageNewData = (newPass) => {
  const updatedUser = {
    ...userStorage,
    data: {
      ...userStorage.data,
      password: newPass,
    },
  };
  setAuthUser(updatedUser);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userId = userStorage.id;
  const currentPass = document.getElementById("old-password").value;
  const newPass = document.getElementById("new-password").value;
  const passConfirm = document.getElementById("confirm-password").value;

  if (!currentPass || !newPass || !passConfirm) {
    alert("Por favor, completa todos los campos.");
    return;
  }
  if (changePassword(userId, currentPass, newPass, passConfirm)) {
    storageNewData(newPass);
  }
});
