const url = "https://api.restful-api.dev/objects";

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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("User created successfully.");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

createUser("John Doe", "john.doe@example.com", "password123", "123 Main St");
