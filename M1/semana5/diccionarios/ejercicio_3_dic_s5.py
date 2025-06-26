# Ejercicio 3

# Crear una lista de keys
list_of_keys = ['access_level', 'age']

# Crear diccionario 
employee = {
    'name': 'John',
    'email': 'john@ecorp.com',
    'access_level': 5,
    'age': 28
}

# Crear variable que guarde los elementos de la lista de keys
key_one = list_of_keys[0]
key_two = list_of_keys[1]

# Eliminar los elementos de la lista de keys del diccionario y guardarlos en variables
access_level = employee.pop(key_one)
age = employee.pop(key_two)

# Imprimir el diccionario y las variables
print(employee)
print(f'Elementos eliminados: {key_one}: {access_level}, {key_two}: {age}')

# Salida: {'name': 'John', 'email': 'john@ecorp.com'}
#         Elementos eliminados: access_level: 5, age: 28  