# Ejercicio 4

#Pide al usuario los 3 números
number_one = int(input('Ingrese el primer número: '))
number_two = int(input('Ingrese el segundo número: '))
number_three = int(input('Ingrese el tercer número: '))

# Si el primer número es mayor a los demás, imprime un mensaje indicandolo
if number_one > (number_two and number_three):
    print(f'{number_one} es el número mayor.')

# Si el primer número es mayor a los demás, imprime un mensaje indicandolo
elif number_two > (number_one and number_three):
    print(f'{number_two} es el número mayor.')
    
# Si el primer número es mayor a los demás, imprime un mensaje indicandolo
elif number_three > (number_one and number_two):
    print(f'{number_three} es el número mayor.')