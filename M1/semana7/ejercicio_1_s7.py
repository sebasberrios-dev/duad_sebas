# Ejercicio 1

# Funcion de suma 
def make_sum(num1, num2):
    return num1 + num2

# Funcion de resta
def make_sub(num1, num2):
    return num1 - num2

# Funcion de multiplicacion
def make_mult(num1, num2):
    return num1 * num2

# Funcion de division
def make_div(num1, num2):
    if num2 == 0:
        raise ZeroDivisionError("No se puede dividir entre cero")
    return num1 / num2

# Funcion para borrar el resultado
def make_clear():
    return 0

# Funcion menu principal
def main():
    current_num = 0
    while True:  
        print("**** Calculadora ***")
        print("1. Sumar")
        print("2. Restar")
        print("3. Multiplicar")
        print("4. Dividir")
        print("5. Borrar resultado")
        print("6. Salir")
        print("********************")

        opt = input("\nSeleccione una opción: ")
        try:
            if opt == "1":
                num = float(input(f"Ingrese el número a sumar (número actual: {current_num}): "))
                current_num = make_sum(current_num, num)
                print(f"Resultado: {current_num}")
              
            elif opt == "2": 
                num = float(input(f"Ingrese el número a restar (número actual: {current_num}): "))
                current_num = make_sub(current_num, num)
                print(f"Resultado: {current_num}")
               
            elif opt == "3":
                num = float(input(f"Ingrese el número a multiplicar (número actual: {current_num}): "))
                current_num = make_mult(current_num, num)
                print(f"Resultado: {current_num}")
              
            
            elif opt == "4":
                num = float(input(f"Ingrese el número a dividir (número actual: {current_num}): "))
                current_num = make_div(current_num, num)
                print(f"Resultado: {current_num}")

            
            elif opt == "5":
                current_num = make_clear()
                print(f"Resultado borrado, número actual: {current_num}")
            
            elif opt == "6":
                print("Saliendo de la calculadora...")
                break

            else:
                print("Opción no válida, intente de nuevo.")

        except ValueError:
            print(f"Error: Entrada no válida, debe ingresar un número.")
        except ZeroDivisionError as ex:
            print(f"Error: {ex}")
            

if __name__ == "__main__":
    main()