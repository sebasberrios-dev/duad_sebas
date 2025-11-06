const priorities = {
  high: { label: "Alta", icon: "🔴", color: "red" },
  medium: { label: "Media", icon: "🟡", color: "yellow" },
  low: { label: "Baja", icon: "🟢", color: "green" },
};

const verifyUser = async (users, userId, password) => {
  try {
    console.log("Verifying user...");
    const user = users.find(
      (u) => u.id === userId && u.data.password === password
    );
    if (user) {
      console.log("User verified:", user);
      return user;
    } else {
      throw new Error("Usuario no encontrado o credenciales inválidas");
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
};

const getTasksByUserId = async () => {
  try {
    const user = getAuthUser();
    if (!user || !user.id) {
      console.log("No authenticated user found");
      return [];
    }

    const tasks = getStoredTasks();
    const userTasks = tasks.filter(
      (task) => task && task.data && task.data.userId === user.id
    );
    console.log("Tasks for user:", userTasks);
    return userTasks;
  } catch (error) {
    console.log("Error getting tasks by user ID:", error);
    return [];
  }
};

const sortByPriority = (tasks) => {
  const order = { high: 3, medium: 2, low: 1 };
  return tasks.sort((a, b) => {
    const priorityA = order[a.data.priority];
    const priorityB = order[b.data.priority];
    return priorityB - priorityA;
  });
};
