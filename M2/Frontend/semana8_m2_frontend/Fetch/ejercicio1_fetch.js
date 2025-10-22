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

const url = "https://api.restful-api.dev/objects";

const getData = async () => {
  try {
    console.log("Fetching data...");
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data fetched successfully.");
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

function formatData(data) {
  console.log("Filtered data:");
  data.forEach((item) => {
    if (item.data === null) {
      item.data = "";
    }
    const details = Object.entries(item.data)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" ");
    console.log(`${item.name} (${details})`);
  });
}

formatData(await getData());
