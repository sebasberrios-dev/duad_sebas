# Ejercicio 3

# Creamos la lista
my_list = [4, 3, 6, 1, 7]

# Verificamos que la lista contenga más de un elemento para poder realizar el intercambio
if len(my_list) > 1:
    # Intercambiamos el primer y ultimo elemento
    my_list[0], my_list[-1] = my_list[-1], my_list[0]

print(my_list)
# Salida: [7, 3, 6, 1, 4]