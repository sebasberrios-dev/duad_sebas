# Ejercicio 7

# Funcion que verifica si un numero es primo
def is_prime(num):
    if num < 2:
        return False
    for div in range(2, int(num**0.5) + 1):
        if num % div == 0:
            return False
    return True

# Funcion que toma una lista de numeros y devuelve una lista con los primos
def get_number(numbers):
    prime_numbers = []
    for num in numbers:
        if is_prime(num):
            prime_numbers.append(num)
    return prime_numbers

numbers = [1, 4, 6, 7, 13, 9, 67]
result = get_number(numbers)
print("Los numeros primos son: ", result)