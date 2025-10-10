async function getUserData(id) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${id}`, {
      headers: {
        "x-api-key": "reqres-free-v1",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`User with ID ${id} not found`);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.log("Error fetching user data:", error);
  } finally {
    console.log("Fetch attempt finished");
  }
}

// Ejercicio 1
getUserData(2);

// Ejercicio 2
getUserData(23);
