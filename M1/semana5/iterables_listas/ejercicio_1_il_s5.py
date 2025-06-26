# Ejercicio 1

# Creamos las listas 
first_list = ['Hay', 'en', 'que', 'iteracion', 'indices', 'muy']
second_list = ['casos', 'los', 'la', 'por', 'es', 'util']

# Se recorre cada ìndice (0 a 5)
for word in range(len(first_list)):
    # Como las listas tienen la misma longitud, podemos acceder a la segunda lista con el mismo indice 
    print(first_list[word] ,second_list[word])

# Salida:
# Hay casos
# en los
# que la
# iteracion por
# indices es
# muy util