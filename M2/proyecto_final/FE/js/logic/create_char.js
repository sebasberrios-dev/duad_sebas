import defaultAttributes from "../utils/char_attributes.js";
import { createCharacter } from "../api/character_endpoints.js";

// CONSTANTES
const INITIAL_LEVEL = 1;
const HOME_PAGE_URL = "/M2/proyecto_final/FE/html/home_page.html";
const SUCCESS_MESSAGE = "Personaje creado exitosamente.";
const ERROR_MESSAGE =
  "Error al crear el personaje. Por favor, inténtalo de nuevo.";

// UTILIDADES PRIVADAS

// Obtener atributos de personaje basados en raza, clase y nivel
function setAttributes(race, className, level = INITIAL_LEVEL) {
  if (!defaultAttributes[race]) {
    throw new Error(`Raza "${race}" no encontrada`);
  }

  if (!defaultAttributes[race][className]) {
    throw new Error(
      `Clase "${className}" no encontrada para la raza "${race}"`,
    );
  }

  const classAttributes = defaultAttributes[race][className];

  if (!classAttributes[level]) {
    throw new Error(`Nivel ${level} no encontrado para ${race} ${className}`);
  }

  return classAttributes[level];
}

// Construir objeto de datos del personaje
function buildCharacterData(charName, race, className, story) {
  return {
    name: charName,
    race: race,
    class: className,
    level: INITIAL_LEVEL,
    attributes: setAttributes(race, className, INITIAL_LEVEL),
    story: story,
  };
}

// Redirigir a la página de inicio
function redirectToHome() {
  window.location.href = HOME_PAGE_URL;
}

// FUNCIONES PÚBLICAS

// Crear un nuevo personaje
const createChar = async (charName, race, className, story) => {
  try {
    console.log("Creating character...");
    const characterData = buildCharacterData(charName, race, className, story);
    const response = await createCharacter(characterData);

    if (response) {
      console.log("Character created successfully.");
      alert(SUCCESS_MESSAGE);
      redirectToHome();
    }
  } catch (error) {
    console.error("Error creating character:", error);
    alert(ERROR_MESSAGE);
  }
};

export { createChar };
