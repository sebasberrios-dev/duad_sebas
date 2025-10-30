const renderTasks = async () => {
  try {
    const tasks = await getUserTasks();
    if (tasks) {
      renderTodoTasks(tasks);
      renderDoneTasks(tasks);
    }
  } catch (error) {
    showErrorState(error);
  }
};

const renderTodoTasks = (tasks) => {
  const todoList = document.querySelector(".todo-list");

  // Limpiar tareas existentes y mensajes de estado vacío
  const existingTasks = todoList.querySelectorAll(".todo-item");
  existingTasks.forEach((item) => item.remove());

  const emptyStates = todoList.querySelectorAll(".empty-state");
  emptyStates.forEach((item) => item.remove());

  const todoTasks = tasks.filter((task) => task.data.status === "pending");
  const sortedTasks = sortByPriority(todoTasks);
  const actionsDiv = todoList.querySelector(".todo-actions");

  if (sortedTasks.length === 0) {
    // Ocultar botones cuando no hay tareas
    if (actionsDiv) {
      actionsDiv.style.display = "none";
    }

    const emptyTodo = document.createElement("li");
    emptyTodo.className = "empty-state";
    emptyTodo.textContent = "No hay tareas pendientes.";
    todoList.appendChild(emptyTodo);
  } else {
    // Mostrar botones cuando hay tareas
    if (actionsDiv) {
      actionsDiv.style.display = "flex";
    }

    sortedTasks.forEach((task) => {
      const taskElement = createTodoElement(task);
      if (actionsDiv) {
        todoList.insertBefore(taskElement, actionsDiv);
      } else {
        todoList.appendChild(taskElement);
      }
    });
  }
};

const renderDoneTasks = (tasks) => {
  const doneList = document.querySelector(".done-list");

  // Limpiar tareas existentes y mensajes de estado vacío
  const existingTasks = doneList.querySelectorAll(".done-item");
  existingTasks.forEach((item) => item.remove());

  const emptyStates = doneList.querySelectorAll(".empty-state");
  emptyStates.forEach((item) => item.remove());

  const doneTasks = tasks.filter((task) => task.data.status === "completed");
  const actionsDiv = doneList.querySelector(".done-actions");

  if (doneTasks.length === 0) {
    // Ocultar botones cuando no hay tareas completadas
    if (actionsDiv) {
      actionsDiv.style.display = "none";
    }

    const emptyDone = document.createElement("li");
    emptyDone.className = "empty-state";
    emptyDone.textContent = "No hay tareas completadas.";
    doneList.appendChild(emptyDone);
  } else {
    // Mostrar botones cuando hay tareas completadas
    if (actionsDiv) {
      actionsDiv.style.display = "flex";
    }

    doneTasks.forEach((task) => {
      const taskElement = createDoneElement(task);
      if (actionsDiv) {
        doneList.insertBefore(taskElement, actionsDiv);
      } else {
        doneList.appendChild(taskElement);
      }
    });
  }
};

const createTodoElement = (task) => {
  const priority = task.data.priority;
  const priorityIcon = priorities[priority].icon;
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.taskId = task.id;
  li.innerHTML = `<input type="checkbox" class="todo-checkbox" data-id="${task.id}"/> ${task.name} ${priorityIcon}`;
  return li;
};

const createDoneElement = (task) => {
  const li = document.createElement("li");
  li.className = "done-item";
  li.dataset.taskId = task.id;
  li.innerHTML = `<input type="checkbox" class="done-checkbox" data-id="${task.id}" /> ${task.name}`;
  return li;
};

const filterTasks = (filter) => {
  const todoContainer = document.querySelector(".todo-container");
  const doneContainer = document.querySelector(".done-container");

  switch (filter) {
    case "todo":
      todoContainer.style.display = "block";
      doneContainer.style.display = "none";
      break;
    case "done":
      todoContainer.style.display = "none";
      doneContainer.style.display = "block";
      break;
  }
};

const showErrorState = (error) => {
  alert(`Error al cargar las tareas: ${error.message}`);
};

const todoEventListeners = () => {
  try {
    const todoForm = document.querySelector(".todo-form");
    const todoInput = document.querySelector(".todo-input");

    todoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const taskName = todoInput.value.trim();
      const priority = document.querySelector(".priority-select").value;
      if (taskName) {
        try {
          const newTask = {
            name: taskName,
            status: "pending",
            priority: priority,
          };
          await createTask(newTask);
          todoInput.value = "";
          renderTasks();
        } catch (error) {
          alert(`Error al crear la tarea: ${error.message}`);
        }
      }
    });

    const deleteButton = document.querySelector("#todo-delete");
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll(".todo-checkbox:checked");
      checkboxes.forEach(async (checkbox) => {
        const taskId = checkbox.dataset.id;
        try {
          await deleteTask(taskId);
          renderTasks();
        } catch (error) {
          alert(`Error al eliminar la tarea: ${error.message}`);
        }
      });
    });

    const completeButton = document.querySelector("#complete");
    completeButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll(".todo-checkbox:checked");
      checkboxes.forEach(async (checkbox) => {
        const taskId = checkbox.dataset.id;
        try {
          await updateTask(taskId, "completed");
          renderTasks();
        } catch (error) {
          alert(`Error al completar la tarea: ${error.message}`);
        }
      });
    });
  } catch (error) {
    console.error("Error setting up to-do event listeners:", error);
    throw error;
  }
};

const doneEventListeners = () => {
  try {
    const deleteButton = document.querySelector("#done-delete");
    deleteButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll(".done-checkbox:checked");
      checkboxes.forEach(async (checkbox) => {
        const taskId = checkbox.dataset.id;
        try {
          await deleteTask(taskId);
          renderTasks();
        } catch (error) {
          alert(`Error al eliminar la tarea: ${error.message}`);
        }
      });
    });

    const revertButton = document.querySelector("#revert");
    revertButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const checkboxes = document.querySelectorAll(".done-checkbox:checked");
      checkboxes.forEach(async (checkbox) => {
        const taskId = checkbox.dataset.id;
        try {
          await updateTask(taskId, "pending");
          renderTasks();
        } catch (error) {
          alert(`Error al revertir la tarea: ${error.message}`);
        }
      });
    });
  } catch (error) {
    console.error("Error setting up done event listeners:", error);
    throw error;
  }
};

const filterEventListeners = () => {
  try {
    // Mostrar "Por Hacer" por defecto
    filterTasks("todo");
    const filterSelect = document.querySelectorAll(".filter-btn");
    filterSelect.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter;
        filterTasks(filter);
      });
    });
  } catch (error) {
    console.error("Error setting up filter event listeners:", error);
    throw error;
  }
};

const logoutEventListener = () => {
  try {
    const logout = document.getElementById("logout");
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      clearAuthUser();
      alert("Sesión cerrada exitosamente.");
      window.location.href = "/M2/Frontend/duad_to_do_list/index.html";
    });
  } catch (error) {
    console.error("Error setting up logout event listener:", error);
    throw error;
  }
};
