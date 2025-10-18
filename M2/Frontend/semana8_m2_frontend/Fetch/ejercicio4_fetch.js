const requestOptions = {
  method: "PATCH",
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json",
  },
  redirect: "follow",
  referrerPolicy: "no-referrer",
};

const updateUser = async (userId, updatedData) => {
  try {
    console.log("Updating user...");
    const newData = {
      data: {
        address: updatedData,
      },
    };

    const response = await fetch(
      `https://api.restful-api.dev/objects/${userId}`,
      {
        ...requestOptions,
        body: JSON.stringify(newData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User updated successfully:", data);
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

updateUser("ff8081819782e69e0199db8bec942578", "500 New Address St");
