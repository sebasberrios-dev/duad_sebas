import { createNpc, getGameNpcs } from "../api/npcs_endpoints.js";
import npcAttributes from "../utils/npc_attributes.js";

// CONSTANTES
const NPC_LEVEL_MIN = 1;
const NPC_LEVEL_MAX = 7;

// UTILIDADES PRIVADAS

// Obtener atributos de NPC basados en rol y nivel
function setNpcAttributes(role, level = 1) {
  if (!npcAttributes[role]) {
    throw new Error(`Rol "${role}" no encontrado`);
  }

  const roleAttributes = npcAttributes[role];

  if (!roleAttributes[level]) {
    throw new Error(`Nivel ${level} no encontrado para el rol "${role}"`);
  }

  return roleAttributes[level];
}

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
function validateNpcFormData(formData) {
  if (
    !formData.name ||
    !formData.role ||
    !formData.level ||
    !formData.description
  ) {
    return "Por favor, complete todos los campos obligatorios.";
  }

  if (formData.level < NPC_LEVEL_MIN || formData.level > NPC_LEVEL_MAX) {
    return `El nivel del NPC debe estar entre ${NPC_LEVEL_MIN} y ${NPC_LEVEL_MAX}.`;
  }

  return null;
}

// Limpiar formulario de NPC
function clearNpcForm() {
  const form = document.getElementById("create-npc-form");
  if (form) {
    form.reset();
  }
}

// Crear elemento option para el select de NPCs
function createNpcOption(npc) {
  const option = document.createElement("option");
  option.value = npc.id;
  option.textContent = `${npc.name} (Nivel ${npc.level})`;
  return option;
}

// Cargar NPCs en el select
async function loadNpcsToSelect(gameId) {
  try {
    const npcs = await getGameNpcs(gameId);
    const npcSelect = document.querySelector(".npc-select");

    if (!npcSelect) return;

    // Limpiar y agregar opción por defecto
    npcSelect.innerHTML =
      '<option value="" disabled selected>Selecciona un NPC</option>';

    // Agregar cada NPC al select
    npcs.forEach((npc) => {
      const option = createNpcOption(npc);
      npcSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading NPCs:", error);
  }
}

// FUNCIONES PÚBLICAS

// Abrir modal de NPC
export const openNpcModal = () => {
  const modal = document.getElementById("npc-modal");
  modal.style.display = "flex";
};

// Cerrar modal de NPC
export const closeNpcModal = () => {
  const modal = document.getElementById("npc-modal");
  modal.style.display = "none";
  clearNpcForm();
};

// Manejar creación de NPC
export const handleCreateNpc = async (e, gameId) => {
  e.preventDefault();

  const formData = getNpcFormData();
  const validationError = validateNpcFormData(formData);

  if (validationError) {
    alert(validationError);
    return;
  }

  try {
    const npcData = {
      name: formData.name,
      role: formData.role,
      level: formData.level,
      description: formData.description,
      attributes: setNpcAttributes(formData.role, formData.level),
      game_id: gameId,
    };

    const response = await createNpc(npcData);

    if (response) {
      alert("NPC creado exitosamente.");
      closeNpcModal();
      await loadNpcsToSelect(gameId);
    }
  } catch (error) {
    console.error("Error creating NPC:", error);
    alert("Error al crear el NPC. Por favor, inténtalo de nuevo.");
  }
};

// Configurar modal y event listeners de NPCs
export const setupNpcModal = (gameId) => {
  const btnCreateNPC = document.querySelector(".btn-create-npc");
  const modalClose = document.querySelector(".modal-close");
  const npcForm = document.getElementById("create-npc-form");
  const modal = document.getElementById("npc-modal");

  // Abrir modal
  btnCreateNPC?.addEventListener("click", openNpcModal);

  // Cerrar modal
  modalClose?.addEventListener("click", closeNpcModal);

  // Cerrar modal al hacer click fuera
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeNpcModal();
    }
  });

  // Manejar envío de formulario
  npcForm?.addEventListener("submit", (e) => handleCreateNpc(e, gameId));

  // Cargar NPCs al iniciar
  loadNpcsToSelect(gameId);
};
