function fetchData(userId) {
  return new Promise((resolve, reject) => {
    fetch(`https://reqres.in/api/users/${userId}`, {
      headers: {
        "x-api-key": "reqres-free-v1",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.data) {
          throw new Error(`User with ID ${userId} not found`);
        }
        resolve(data.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
fetchData(2)
  .then((user) => {
    console.log("User data:", user);
  })
  .catch((error) => {
    console.log("Error fetching user data:", error);
  })
  .finally(() => {
    console.log("Fetch attempt finished");
  });

fetchData(23)
  .then((user) => {
    console.log("User data:", user);
  })
  .catch((error) => {
    console.log("Error fetching user data:", error);
  })
  .finally(() => {
    console.log("Fetch attempt finished");
  });

console.log("Fetching user data...");
