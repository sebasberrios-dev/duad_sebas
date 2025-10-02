// Ejercicio 1
const myArray = ["Hola", "Cómo", "estás", "hoy?"];
myArray.forEach((element) => console.log(element));

// Ejercicio 2.1
const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = numbersArray.map((num) => {
  if (num % 2 === 0) {
    return num;
  }
});
console.log(evenNumbers);

// Ejercicio 2.2
const numbersArray2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers2 = numbersArray2.filter((num) => num % 2 === 0);
console.log(evenNumbers2);

// Ejercicio 3
tempCeltius = [20, 30, 25, 15, 10];
const tempFahrenheit = tempCeltius.map((temp) => (temp * 9) / 5 + 32);
console.log(tempFahrenheit);

// Ejercicio 4
const myString = "Hello my name is Sebastian";
console.log(myString.split(" "));

// Ejercicio 5
const studentObject = {
  name: "John Doe",
  grades: [
    { name: "math", grade: 80 },
    { name: "science", grade: 100 },
    { name: "history", grade: 60 },
    { name: "PE", grade: 90 },
    { name: "music", grade: 98 },
  ],
};
// Declaramos el objeto result como let para modificarlo más adelante
let result = {};

// Asignamos el key 'name' al objeto con el valor del nombre del estudiante en studentObject
result.name = studentObject.name;

// Creamos un array con las notas y otro con las materias
const grades = studentObject.grades.map((subject) => subject.grade);
const subjects = studentObject.grades.map((subject) => subject.name);

// Calculamos el promedio usando un forEach para sumar el valor de totalGrades con cada nota y luego dividiéndolo por la cantidad de notas
let totalGrades = 0;
grades.forEach((grade) => {
  totalGrades += grade;
});
result.gradeAvg = totalGrades / grades.length;

// Calculamos la nota más alta y la más baja en el array de notas
const maxGrade = Math.max(...grades);
const minGrade = Math.min(...grades);

// Asignamos las materias con las notas más alta y baja al objeto result buscando el índice de cada nota en el array de notas con indexOf
result.highestGrade = subjects[grades.indexOf(maxGrade)];
result.lowestGrade = subjects[grades.indexOf(minGrade)];
console.log(result);
