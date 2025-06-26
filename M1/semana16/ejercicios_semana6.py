# Ejercicio 3
# Funcion para sumar elementos de una lista
def sum_list(numbers):
    total = 0
    for number in numbers:
        total += number
    return total


# Ejercicio 4
# Funcion para dar vuelta a un string
def reverse_string(string):
    if not isinstance(string, str):
        raise TypeError('Error: La entrada debe ser una cadena de texto')
    result = ''
    for char in range(len(string) -1, -1, -1):
        result += string[char]
    return result


# Ejercicio 5
# Funcion para ver el numero de mayusciulas y minusculas en un string
def count_case(string):
    upper_count = 0
    lower_count = 0
    for char in string:
        if char.isupper():
            upper_count += 1
        elif char.islower():
            lower_count += 1
    return f'La oración {string} tiene {upper_count} mayúsculas y {lower_count} minúsculas.'

# Ejercicio 6
def sort_string(string):
    for char in string:
        if not char.isalnum() and char != '-':
            return 'Debes separar las palabras solo con guiones'
        
    word = ''
    list_words = []

    for char in string:
        if char == '-':
            list_words.append(word)
            word = ''
        else:
            word += char  

    list_words.append(word)

    if list_words == sorted(list_words):
        return 'La lista ya está ordenada'
      
    list_words.sort()
    
    result = ''

    for word in range(len(list_words)):
        result += list_words[word]

        if word != len(list_words) - 1:
            result += '-'
        
    return result

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
    
    if not numbers:
        return 'Tienes que añadir números a la lista.'

    if not prime_numbers:
        return 'La lista no contiene números primos.'
    
    return prime_numbers

numbers = [1, 4, 6, 10, 12, 16, 20]
print(f'{get_number(numbers)}')


