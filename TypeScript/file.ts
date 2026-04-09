// Types
type Usuario = {
  username: string;
  password: string;
};

const usuario1: Usuario = {
  username: "SebastiánBerrios123",
  password: "sebas1234",
};

console.log(
  `Tu nombre de usuario es ${usuario1.username} y tu contraseña es ${usuario1.password}`,
);

// Interfaces
interface Persona {
  name: string;
  age: number;
}

interface Empleado extends Persona {
  career: string;
}

const trabajador: Empleado = {
  name: "Sebastián Berríos Aguilera",
  age: 21,
  career: "Desarrollador Web",
};

console.log(
  `Mi nombre es ${trabajador.name}, tengo ${trabajador.age} años y soy ${trabajador.career.toLowerCase()}`,
);

function obtenerLongitud<T extends { length: number }>(item: T): number {
  return item.length;
}

console.log(obtenerLongitud("Hola"));
console.log(obtenerLongitud([2, 0, 2, 6]));

function obtenerPropiedad<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const usuario = { nombre: "Juan", edad: 25 };
console.log(obtenerPropiedad(usuario, "nombre"));
