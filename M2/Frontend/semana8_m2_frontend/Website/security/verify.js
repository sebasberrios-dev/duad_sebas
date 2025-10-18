const verifyUser = async (storageInstance, apiInstance, userId, password) => {
  try {
    if (!storageInstance) {
      if (
        apiInstance.data.id === userId &&
        apiInstance.data.data.password === password
      ) {
        setAuthUser(apiInstance.data);
        return true;
      } else {
        return false;
      }
    } else {
      if (
        storageInstance.id === userId &&
        storageInstance.data.password === password
      ) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log("Error verifying user:", error);
    return false;
  }
};
