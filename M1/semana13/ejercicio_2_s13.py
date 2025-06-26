# Decorador
def is_number(func):
    def wrapper(*args):
        for arg in args:
            if not isinstance(arg, (int, float)):
                raise ValueError('La entrada debe ser un número.')
        
        return func(*args)

    return wrapper

@is_number
def make_sum(num1, num2):
    return num1 + num2

@is_number
def make_sub(num1, num2):
    return num1 - num2

@is_number
def make_mult(num1, num2):
    return num1 * num2

try: 
    num1 = 8
    num2 = 7
    print(f'Suma: {make_sum(num1, num2)}\n'
          f'Resta: {make_sub(num1, num2)}\n'
          f'Multiplicación: {make_mult(num1, num2)}')

except ValueError as e:
    print(e)
    

    
    
