# Ejercicio 3

# Funcion para sumar elementos de una lista
def sum_list(numbers):
    total = 0
    for number in numbers:
        total += number
    return total

numbers = [6, 2, 3]
result = sum_list(numbers)
print(f'La suma de los elementos de la lista es: {result}') 