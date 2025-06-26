# Ejercicio 2

# Pide la información al usuario
name = input('Ingrese su nombre: ')
last_name = input('Ingrese su apellido: ')
age = int(input('Ingrese su edad: '))

# Condicionales para determinar la etapa de la persona
if age <= 5:
    print(f'{name} {last_name} es un bebé.')

elif age <= 10:
    print(f'{name} {last_name} es un niño.')

elif age <= 12:
    print(f'{name} {last_name} es un preadolescente.')

elif age <= 17:
    print(f'{name} {last_name} es un adolescente.')

elif age >= 18:
    print(f'{name} {last_name} es un adulto joven.')

elif age >= 35:
    print(f'{name} {last_name} es un adulto.')

elif age >= 65:
    print(f'{name} {last_name} es un adulto mayor.')

else: 
    print('Edad no válida.')