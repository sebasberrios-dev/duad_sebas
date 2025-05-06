# Ejercicio 4

# Creamos la lista
my_list = [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Recorremos de atrás hacia adelante para evitar que se modifiquen los indices que no se han procesado
for num in range(len(my_list)-1,-1,-1):
    # Si el número es impar se elimina el número de ese indice
    if my_list[num] % 2 != 0:
        my_list.pop(num)

print(my_list) 
# Salida: [2, 4, 6, 8]