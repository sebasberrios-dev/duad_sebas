# Ejercicio 1 

# Funcion 1 
def ask_name():
    name = input('Cual es tu nombre: ')
    return name

# Funcion 2
def print_name():
    name = ask_name()
    print(f'Mi nombre es {name}') 

print_name()