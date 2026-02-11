import npcAttributes from "../utils/npc_attributes.js";

// CONSTANTES
const NPC_LEVEL_DEFAULT = 1;
const NPC_LEVEL_MIN = 1;
const NPC_LEVEL_MAX = 7;
const HOME_PAGE_URL = "/M2/proyecto_final/FE/html/home_page.html";
const SUCCESS_MESSAGE = "NPC creado exitosamente.";
const ERROR_MESSAGE = "Error al crear el NPC. Por favor, inténtalo de nuevo.";
const INCOMPLETE_FIELDS_MESSAGE =
  "Por favor, complete todos los campos obligatorios.";
const INVALID_LEVEL_MESSAGE = `El nivel del NPC debe estar entre ${NPC_LEVEL_MIN} y ${NPC_LEVEL_MAX}.`;

// UTILIDADES PRIVADAS

// Obtener atributos de NPC basados en rol y nivel
const setNpcAttributes = (role, level = NPC_LEVEL_DEFAULT) => {
  if (!npcAttributes[role]) {
    throw new Error(`Rol "${role}" no encontrado`);
  }

  const roleAttributes = npcAttributes[role];

  if (!roleAttributes[level]) {
    throw new Error(`Nivel ${level} no encontrado para el rol "${role}"`);
  }

  return roleAttributes[level];
};

// Obtener datos del formulario
function getNpcFormData() {
  return {
    name: document.getElementById("npc-name").value.trim(),
    role: document.getElementById("npc-role").value,
    level: parseInt(document.getElementById("npc-level").value),
    description: document.getElementById("npc-description").value.trim(),
  };
}

// Validar datos del formulario
function validateNpcData(name, role, level, description) {
  if (!name || !role || !level || !description) {
    alert(INCOMPLETE_FIELDS_MESSAGE);
    return false;
  }

  if (level < NPC_LEVEL_MIN || level > NPC_LEVEL_MAX) {
    alert(INVALID_LEVEL_MESSAGE);
    return false;
  }

  return true;
}

// Construir objeto de datos del NPC
function buildNpcData(npcName, role, level, description) {
  return {
    name: npcName,
    role: role,
    level: level,
    description: description,
    attributes: setNpcAttributes(role, level),
  };
}

// Redirigir a la página de inicio
function redirectToHome() {
  window.location.href = HOME_PAGE_URL;
}

// Crear NPC
const createNpc = async (npcName, role, level, description) => {
  try {
    console.log("Creating NPC...");
    const npcData = buildNpcData(npcName, role, level, description);
    const response = await createNpc(npcData);

    if (response) {
      console.log("NPC created successfully.");
      alert(SUCCESS_MESSAGE);
      redirectToHome();
    }
  } catch (error) {
    console.error("Error creating NPC:", error);
    alert(ERROR_MESSAGE);
  }
};

// Manejar envío del formulario
async function handleNpcFormSubmit(e) {
  e.preventDefault();

  const { name, role, level, description } = getNpcFormData();

  if (!validateNpcData(name, role, level, description)) {
    return;
  }

  await createNpc(name, role, level, description);
}

// INICIALIZACIÓN

const createNpcForm = document.getElementById("create-npc-form");

if (createNpcForm) {
  createNpcForm.addEventListener("submit", handleNpcFormSubmit);
}
