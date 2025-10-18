const userInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
});

const button = document.getElementById("updateButton");

const updateUser = async (userId, updatedData) => {
  try {
    const newData = {
      data: {
        address: updatedData,
      },
    };
    const response = await userInstance.patch(`/${userId}`, newData);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("User updated successfully:");
    const info = Object.entries(response.data.data)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" ");
    console.log(
      `ID: ${response.data.id} Name: ${response.data.name}. Data updated: ${info}`
    );
    document.getElementById(
      "data"
    ).innerHTML += `<p>ID: ${response.data.id} Name: ${response.data.name}. <br> Data updated: ${info}</p>`;
  } catch (err) {
    console.error("Error updating user:", err);
    document.getElementById(
      "data"
    ).innerHTML += `<p style="color: red;">Error updating user: ${err.message}</p>`;
  }
};

button.addEventListener("click", () =>
  updateUser("ff8081819782e69e0199e0862cfb33b5", "New Address 123")
);
