const createTask = async (task) => {
  try {
    const user = getAuthUser();
    const taskData = {
      name: task.name,
      data: {
        userId: user.id,
        status: task.status,
        priority: task.priority,
      },
    };
    const response = await create(taskData);
    pushTask(response);
    console.log("Task created and stored:", response);
    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

const getUserTasks = async () => {
  try {
    const tasks = await getTasksByUserId();
    return tasks;
  } catch (error) {
    console.error("Error getting user tasks:", error);
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    const tasks = getStoredTasks();
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    console.log("Task deleted. Updated tasks:", updatedTasks);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

const updateTask = async (taskId, newStatus) => {
  try {
    const tasks = getStoredTasks();
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    tasks[taskIndex].data.status = newStatus;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    console.log("Task updated. Updated task:", tasks[taskIndex]);
    return tasks[taskIndex];
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};
