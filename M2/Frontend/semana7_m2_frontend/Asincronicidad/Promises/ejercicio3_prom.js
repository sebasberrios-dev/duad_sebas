function sentenceFromArray(arr) {
  const word1 = new Promise((resolve) => {
    setTimeout(() => {
      console.log(arr[0]);
      resolve(arr[0]);
    }, 2000);
  });

  const word2 = new Promise((resolve) => {
    setTimeout(() => {
      console.log(arr[1]);
      resolve(arr[1]);
    }, 1000);
  });

  const word3 = new Promise((resolve) => {
    setTimeout(() => {
      console.log(arr[2]);
      resolve(arr[2]);
    }, 2500);
  });

  const word4 = new Promise((resolve) => {
    setTimeout(() => {
      console.log(arr[3]);
      resolve(arr[3]);
    }, 1500);
  });

  return Promise.all([word1, word2, word3, word4]);
}

const array = ["very", "Dogs", "cute", "are"];

sentenceFromArray(array);
