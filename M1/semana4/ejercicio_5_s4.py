# Ejercicio 5

# Declaración de variables
grade_counter = 0
passed_grades = 0
failed_grades = 0
average_p_grades = 0
average_f_grades = 0
total_average = 0


total_grades = int(input('Ingrese la cantidad de notas: ')) # Pide al usuario la cantidad total de notas 

# Ciclo para pedir la nota en base a la cantidad de notas que ingresó el usuario
while (grade_counter < total_grades):
    grade_counter = grade_counter + 1 # Suma 1 a la variable de contador que habíamos declarado antes hasta que llegue a la cantidad de notas que el usuario ingresó
    current_grade = int(input(f'Ingrese la nota {grade_counter}: ')) # Pide al usuario la nota 
    if (current_grade < 70):
        failed_grades = failed_grades + 1 # Suma 1 a la variable de notas reprobadas si la nota ingresada es menor a 70
        average_f_grades = average_f_grades + current_grade # Suma la nota a la variable de promedio de notas reprobadas 
    
    elif (current_grade >= 70):
        passed_grades = passed_grades + 1 # Si la nota no es menor a 70, se suma 1 a la variable de notas aprobadas
        average_p_grades = average_p_grades + current_grade # Se suma la nota a la variable de notas aprobadas
    
    total_average = total_average + (current_grade / total_grades) # Se suma el resultado de la división de la nota actual entre el total de notas a la variable de promedio total de notas

# Condicionales para evitar el error ZeroDivisionError, se verifica que las variables sean diferentes a 0 y se procede a hacer la división si es así
# y sino, la variable queda valiendo 0 
if (failed_grades != 0):
    average_f_grades = average_f_grades / failed_grades # Se divide el promedio de notas reprobadas entre la cantidad de notas reprobadas y se guarda en la variable de notas reprobadas para dar el total

else:
    average_f_grades = 0
    
if (passed_grades != 0):
    average_p_grades = average_p_grades / passed_grades # Se divide el promedio de notas aprobadas entre la cantidad de notas aprobadas y se guarda en la variable de notas aprobadas para dar el total

else:
    average_p_grades = 0

# Se imprimen los mensajes con la información
print(f'El estudiante aprobó {passed_grades} notas para un promedio de {average_p_grades} en notas aprobadas.')
print(f'El estudiante reprobó {failed_grades} notas para un promedio de {average_f_grades} en notas reprobadas.')
print(f'El promedio total de las notas es {total_average}')