# Ejercicio 2

# 2.1
def access_local_variable():
    local_var = 10
    print (f'Mi variable local es: {local_var}')

print (f'La variable local es: {local_var}') # Esto no funcionara porque la variable local no es accesible fuera de la funcion

# 2.2
global_var = 20

def access_global_variable():
    global_var = 30
    print (f'Mi variable global es: {global_var}') # Aquí toma el cambio de la variable global como una distinta local, por lo que no se puede acceder a la variable global
access_global_variable()
print (f'La variable global es: {global_var}') # Imprime la variable global original