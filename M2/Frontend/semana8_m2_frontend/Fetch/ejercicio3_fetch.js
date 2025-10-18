const requestOptions = {
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  redirect: "follow",
  referrerPolicy: "no-referrer",
};

const getUser = async (userId) => {
  try {
    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
};

function formatUserData(user) {
  console.log("User data:");
  if (user.data === null) {
    console.log("No data available for this user.");
    return;
  }
  const info = Object.entries(user.data)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" ");
  console.log(`ID: ${user.id} Name: ${user.name} ${info}`);
}

formatUserData(await getUser("ff8081819782e69e0199db5a2eee2526"));
