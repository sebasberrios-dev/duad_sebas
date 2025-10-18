const userInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
});

const button = document.getElementById("fetchButton");

const getUser = async (userId) => {
  try {
    const response = await userInstance.get(`/${userId}`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("User data fetched successfully:");
    if (response.data && response.data.data === null) {
      console.log("No data available for this user.");
      document.getElementById(
        "data"
      ).innerHTML += `<p>No user data available</p>`;
    }
    const info = Object.entries(response.data.data)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" ");
    console.log(`ID: ${response.data.id} Name: ${response.data.name} ${info}`);
    document.getElementById(
      "data"
    ).innerHTML += `<p>ID: ${response.data.id} Name: ${response.data.name} ${info}</p>`;
  } catch (err) {
    console.error("Error fetching data:", err);
    document.getElementById(
      "data"
    ).innerHTML += `<p style="color: red;">Error fetching data: ${err.message}</p>`;
  }
};

button.addEventListener("click", () =>
  getUser("ff8081819782e69e0199e0862cfb33b5")
);
