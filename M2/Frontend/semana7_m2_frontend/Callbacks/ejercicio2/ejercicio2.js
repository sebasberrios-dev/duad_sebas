// Modulo 'fs' para manejar el sistema de archivos
const fs = require("fs");

// Función callback para leer archivos
const readFiles = (filename1, filename2) => {
  const content1 = fs.readFileSync(filename1, "utf8");
  const words1 = content1.split("\n").map((word) => word.trim());

  const content2 = fs.readFileSync(filename2, "utf8");
  const words2 = content2.split("\n").map((word) => word.trim());

  console.log("Archivos leídos correctamente");
  return { words1, words2 };
};

// Función principal que recibe la callback como parámetro
function compareWords(readCallback) {
  const { words1, words2 } = readCallback(
    "M2\\Frontend\\semana7_m2_frontend\\Callbacks\\ejercicio2\\content1.txt",
    "M2\\Frontend\\semana7_m2_frontend\\Callbacks\\ejercicio2\\content2.txt"
  );

  const commonWords = words1.filter((word) => words2.includes(word));

  console.log("Palabras comunes:", commonWords);
  console.log("Mensaje escondido:", commonWords.join(" "));
}

// Prueba de la función
compareWords(readFiles);
