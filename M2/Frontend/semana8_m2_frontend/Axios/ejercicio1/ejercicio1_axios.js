const objectInstance = axios.create({
  baseURL: "https://api.restful-api.dev/objects",
  headers: { "Content-Type": "application/json" },
});

const button = document.getElementById("fetchButton");

const getData = async () => {
  try {
    const response = await objectInstance.get();
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response.data.forEach((item) => {
      if (item.data === null) {
        item.data = "";
      }
      const details = Object.entries(item.data)
        .map(([key, value]) => `${key}: ${value}`)
        .join(" ");
      document.getElementById(
        "data"
      ).innerHTML += `<p>${item.name} (${details})</p>`;
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    document.getElementById(
      "data"
    ).innerHTML += `<p style="color: red;">Error fetching data: ${err.message}</p>`;
  }
};

button.addEventListener("click", getData);
