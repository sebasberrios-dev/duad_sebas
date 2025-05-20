# Decorador    
def print_results(func):
    def wrapper(*args):
        func_return = func(*args)
        print(f'Las notas son: {args}\n'
              f'El promedio es: {func_return}')
        
    return wrapper


@print_results
def get_average(science_score, spanish_score):
    return (science_score + spanish_score) / 2

science_score = int(input('Ingrese su nota de ciencias: '))
spanish_score = int(input('Ingrese su nota de español: '))

get_average(science_score, spanish_score)




