let currentUser = null;
const USERS_KEY = "todoapp_users";
const TASKS_KEY = "todoapp_tasks";

// Autenticación y gestión de usuario
const setAuthUser = (user) => {
  try {
    currentUser = user;
    localStorage.setItem("user", JSON.stringify(user));
    console.log("User set:", currentUser);
  } catch (error) {
    console.error("Error setting user:", error);
  }
};

const getAuthUser = () => {
  try {
    if (!currentUser) {
      currentUser = JSON.parse(localStorage.getItem("user"));
    }
    return currentUser;
  } catch (error) {
    console.error("Error getting user:", error);
  }
};

const isAuthenticated = () => {
  try {
    return !!getAuthUser();
  } catch (error) {
    console.error("Error checking authentication:", error);
  }
};

const clearAuthUser = () => {
  try {
    currentUser = null;
    localStorage.removeItem("user");
    console.log("User cleared");
  } catch (error) {
    console.error("Error clearing user:", error);
  }
};

// Se utiliza el localStorage para simular una base de datos
const pushUser = async (user) => {
  try {
    const existingUsers = getStoredUsers();
    existingUsers.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
    console.log("User pushed:", user);
    console.log("Total users stored:", existingUsers.length);
    console.log("All stored users:", existingUsers);
  } catch (error) {
    console.error("Error pushing user:", error);
  }
};

const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const users = stored ? JSON.parse(stored) : [];
    console.log("Getting stored users. Total:", users.length);
    return users;
  } catch (error) {
    console.error("Error getting stored users:", error);
    return [];
  }
};

const pushTask = async (task) => {
  try {
    const existingTasks = getStoredTasks();
    existingTasks.push(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(existingTasks));
    console.log("Task pushed:", task);
    console.log("Total tasks stored:", existingTasks.length);
  } catch (error) {
    console.error("Error pushing task:", error);
  }
};

const getStoredTasks = () => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    const tasks = stored ? JSON.parse(stored) : [];
    console.log("Getting stored tasks. Total:", tasks.length);
    return tasks;
  } catch (error) {
    console.error("Error getting stored tasks:", error);
    return [];
  }
};
