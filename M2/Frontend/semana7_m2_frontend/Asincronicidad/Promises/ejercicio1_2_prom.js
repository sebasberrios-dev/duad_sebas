// Ejercicio 1 - Promise.all()
function fetchPokemonData(poke1, poke2, poke3) {
  const promise1 = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke1}`)
      .then((res) => res.json())
      .then((data) => resolve(data.name))
      .catch((error) => {
        console.log("Error fetching Pokemon 1:", error);
        reject(error);
      });
  });

  const promise2 = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke2}`)
      .then((res) => res.json())
      .then((data) => resolve(data.name))
      .catch((error) => {
        console.log("Error fetching Pokemon 2:", error);
        reject(error);
      });
  });

  const promise3 = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke3}`)
      .then((res) => res.json())
      .then((data) => resolve(data.name))
      .catch((error) => {
        console.log("Error fetching Pokemon 3:", error);
        reject(error);
      });
  });

  return Promise.all([promise1, promise2, promise3]);
}

fetchPokemonData(1, 4, 7)
  .then((results) => {
    console.log("All Pokemons:", results);
  })
  .catch((error) => {
    console.log("Error fetching Pokemons:", error);
  });

// Ejercicio 2 - Promise.any()
function fetchPokemonData2(poke1, poke2, poke3) {
  const promise1 = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke1}`)
      .then((res) => res.json())
      .then((data) => resolve(data.name))
      .catch((error) => {
        console.log("Error fetching Pokemon 1:", error);
        reject(error);
      });
  });

  const promise2 = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke2}`)
      .then((res) => res.json())
      .then((data) => resolve(data.name))
      .catch((error) => {
        console.log("Error fetching Pokemon 2:", error);
        reject(error);
      });
  });

  const promise3 = new Promise((resolve, reject) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${poke3}`)
      .then((res) => res.json())
      .then((data) => resolve(data.name))
      .catch((error) => {
        console.log("Error fetching Pokemon 3:", error);
        reject(error);
      });
  });

  return Promise.any([promise1, promise2, promise3]);
}

fetchPokemonData2(1, 4, 7)
  .then((result) => {
    console.log("First Pokemon fetched:", result);
  })
  .catch((error) => {
    console.log("Error fetching Pokemons:", error);
  });
