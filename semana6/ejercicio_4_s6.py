# Ejercicio 4

# Funcion para dar vuelta a un string
def reverse_string(string):
    result = ''
    for char in range(len(string) -1, -1, -1):
        result += string[char]
    return result

my_string = 'Hola mundo'
result = reverse_string(my_string)
print(result)
