// Para inicializar la aplicación y verificar autenticación
const initializeApp = async () => {
  try {
    if (isAuthenticated()) {
      filterEventListeners();
      renderTasks();
      todoEventListeners();
      doneEventListeners();
      logoutEventListener();
    } else {
      alert("Debes iniciar sesión.");
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Error initializing app:", error);
  }
};

initializeApp();
