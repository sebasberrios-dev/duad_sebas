# Ejercicio 2

# Crear dos listas del mismo tamaño
list_a = ['first_name', 'last_name', 'role']
list_b = ['Alek', 'Castillo', 'Software Engineer']

# Crear un diccionario a partir de las listas, una para keys y otra para values sin usar zip
my_dict = {}
# Iteramos sobre la longitud de la lista
for info in range(len(list_a)):
    # El elemento que recorremos de la lista a se convierte en la key del diccionario
    # y el elemento que recorremos de la lista b se convierte en el value del diccionario
    my_dict[list_a[info]] = list_b[info]

# Imprimir el diccionario
print(my_dict)

# Salida: {'first_name': 'Alek', 'last_name': 'Castillo', 'role': 'Software Engineer'}