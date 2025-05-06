# Ejercicio 1
string_var = 'Esto es una variable string'
string_var_two = 'Esto es otra variable string'
int_var = 5
list_var = [2,5,6,4,8]
list_var_two = ['Hello', 'World']
float_var = 3.14
true_var = True
false_var = False

# Salida sin f-string: Esto es una variable stringEsto es otra variable string
# Salida con f-string: Esto es una variable string + Esto es otra variable string
print(f'{string_var} + {string_var_two}')
# Salida sin f-string: TypeError: can only concatenate str (not "int") to str
# Salida con f-string: Esto es una variable string + 5
print(f'{string_var} + {int_var}')
# Salida sin f-string: TypeError: unsupported operand type(s) for +: 'int' and 'str'
# Salida con f-string: 5 + Esto es otra variable string
print(f'{int_var} + {string_var_two}')
# Salida sin f-string: [2, 5, 6, 4, 8, 'Hello', 'World']
# Salida con f-string: [2, 5, 6, 4, 8] + ['Hello', 'World']
print(f'{list_var} + {list_var_two}')
# Salida sin f- string: TypeError: can only concatenate str (not "list") to str
# Salida con f-string: Esto es una variable string + ['Hello', 'World'] 
print(f'{string_var} + {list_var_two}')
# Salida sin f-string: 8.14
# Salida con f-string: 3.14 + 5
print(f'{float_var} + {int_var}')
# Salida sin f-string: 1
# Salida con f-string: True + False
print(f'{true_var} + {false_var}')