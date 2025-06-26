# Ejercicio 2

# Declaramos el string
my_string = 'Pizza con piña'

# El primer -1 indica que el recorrido empieza en el último indice
# El segundo indica que recorre hasta el primer indice 
# El tercero indica el paso negativo, va en reversa
for char in range(len(my_string) -1, -1, -1):
    print(my_string[char]) # Recorremos el string usando el recorrido que establecimos anteriormente

# Salida: 
# a 
# ñ
# i
# p

# n
# o
# c

# a
# z
# z
# i
# P