# Ejercicio 3
import random # Librería que me permite generar el número aleatorio

secret_number = random.randint(1,10) # Variable que guarda el número aleatorio del 1 al 10

# Ciclo para determinar si se cierra o no el programa 
while (True):
    number = int(input('Ingrese un número del 1 al 10: ')) # Solicita al usuario un número del 1 al 10
    # Compara el número ingresado por el usuario con el número aleatorio 
    # que se generó y determina si coincide o no
    if number == secret_number:
        print(f'Adivinaste el número. {secret_number}')
        break # Termina el ciclo y cierra el programa si los números coinciden
    
    elif number != secret_number:
       print('No adivinaste el número. Intente de nuevo.') 
       # Repite el ciclo hasta que coincidan los números