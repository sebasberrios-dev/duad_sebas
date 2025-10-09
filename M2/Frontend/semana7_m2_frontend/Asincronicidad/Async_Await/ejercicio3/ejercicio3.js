const userIdInput = document.getElementById("userIdInput");
const button = document.getElementById("searchButton");
const userInfo = document.getElementById("userInfo");

async function getUserData(userId) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${userId}`, {
      headers: {
        "x-api-key": "reqres-free-v1",
      },
    });
    if (!response.ok) {
      throw new Error("User not found");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
}

function displayUserInfo(user) {
  userInfo.innerHTML = `
      <p><strong>Name:</strong> ${user.first_name}</p>
      <p><strong>Last Name:</strong> ${user.last_name}</p>
      <p><strong>Email:</strong> ${user.email}</p>`;
}

button.addEventListener("click", async () => {
  const userId = userIdInput.value;
  try {
    const user = await getUserData(userId);
    displayUserInfo(user);
  } catch (error) {
    userInfo.innerHTML = `<p><strong>Error:</strong> ${error.message}</p>`;
  }
});
