const userInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
});

const button = document.getElementById("createButton");

const createUser = async (name, email, password, address) => {
  try {
    console.log("Creating user...");
    const userData = {
      name: name,
      data: {
        email: email,
        password: password,
        address: address,
      },
    };
    const response = await userInstance.post("", userData);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("User created successfully:");
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    document.getElementById(
      "data"
    ).innerHTML += `<p style="color: red;">Error creating user: ${error.message}</p>`;
  }
};

const formatUserData = (user) => {
  try {
    console.log("Formatting user data...");
    const details = Object.entries(user.data)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" ");
    console.log(`ID: ${user.id} Name: ${user.name} ${details}`);
    document.getElementById(
      "data"
    ).innerHTML += `<p>ID: ${user.id} Name: ${user.name} ${details}</p>`;
  } catch (error) {
    console.error("Error formatting user data:", error);
    document.getElementById(
      "data"
    ).innerHTML += `<p style="color: red;">Error formatting user data: ${error.message}</p>`;
  }
};

button.addEventListener("click", async () => {
  const user = await createUser(
    "Jane Doe",
    "jane.doe@example.com",
    "password123",
    "123 Main St"
  );
  if (user) {
    formatUserData(user);
  }
});
