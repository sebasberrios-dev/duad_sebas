let currentUser = null;

const setAuthUser = (user) => {
  currentUser = user;
  localStorage.setItem("user", JSON.stringify(user));
  console.log("User set:", user);
};

const getAuthUser = () => {
  if (!currentUser) {
    currentUser = JSON.parse(localStorage.getItem("user"));
  }
  return currentUser;
};

const isAuthenticated = () => {
  return !!getAuthUser();
};

const clearAuth = () => {
  currentUser = null;
  localStorage.removeItem("user");
  console.log("User cleared");
};
