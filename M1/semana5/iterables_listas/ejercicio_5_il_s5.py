# Ejercicio 5

# Creamos la lista vacía
numbers = []
# Pedimos al usuario que ingrese diez números
for num in range(10):
    number = int(input(f'Ingrese el número {num + 1}: ')) # +1 porque el rango empieza en 0
    # Añadimos los números a la lista
    numbers.append(number)

# Verificamos cual es el número mayor de la lista
max_number = numbers[0] # Determinamos que el número mayor es el primero de la lista
# Recorremos la lista desde el segundo número hasta el último
for num in range(1, len(numbers)):
    # Si el número actual es mayor que el número mayor encontrado hasta ahora, actualizamos la variable
    if numbers[num] > max_number: 
        max_number = numbers[num] 

print(f'{numbers}. El más alto fue {max_number}')
# Salida:
# [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]. El más alto fue 10