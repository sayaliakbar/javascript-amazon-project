// const xhr = new XMLHttpRequest();

// xhr.open("GET", "https://supersimplebackend.dev/greeting");

// xhr.send();

// xhr.addEventListener("load", () => {
// console.log(xhr.response);
// });

// const response = fetch("https://supersimplebackend.dev/greeting");

// response.then((response) => {
//   response.text().then((response) => {
//     console.log(response);
//   });
// });

async function getData() {
  const response = await fetch("https://supersimplebackend.dev/greeting");

  const result = await response.text();

  console.log(result);
}

// getData();

async function sendData() {
  const response = await fetch("https://supersimplebackend.dev/greeting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Ali Akbar",
    }),
  });

  const result = await response.text();
  console.log(result);
}

// sendData();

async function getAmazonData() {
  try {
    const response = await fetch("https://amazon.com");
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.log("CORS error. Your request was blocked by the backend.");
  }
}

// getAmazonData();

async function sendData() {
  try {
    const response = await fetch("https://supersimplebackend.dev/greeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 400) {
      throw response;
    }

    const result = await response.text();
    console.log(result);
  } catch (error) {
    if (error.status === 400) {
      const result = await error.json();

      console.error(result.errorMessage);
    } else {
      console.error("Network error. Please try again later!");
    }
  }
}

sendData();
