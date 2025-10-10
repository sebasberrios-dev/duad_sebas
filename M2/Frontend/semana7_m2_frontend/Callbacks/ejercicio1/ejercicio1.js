// Función callback para determinar si un número es par o impar
const operation = (num) => {
  if (num % 2 === 0) {
    console.log("The number is even");
  } else {
    console.log("The number is odd");
  }
};

// Función principal que recibe un número y dos callbacks
function evenOrOdd(num, callbackFunction) {
  callbackFunction(num);
}

// Prueba de la función
evenOrOdd(3, operation);
evenOrOdd(4, operation);
