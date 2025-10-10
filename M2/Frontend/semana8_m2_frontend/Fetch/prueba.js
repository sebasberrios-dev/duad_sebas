const data = {
  firstName: "John",
  lastName: "Doe",
};

const url = "https://api.restful-api.dev/objects";

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
} else {
  const result = await response.json();
  console.log("User created successfully:", result);
}
