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

my_string = input('Escribe una oración: ')
result = count_case(my_string)

print(result)