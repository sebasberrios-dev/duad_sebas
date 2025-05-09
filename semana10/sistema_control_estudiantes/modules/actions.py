
# Funciones para el ingreso de datos de los estudiantes, sus notas y promedios 
def check_valid_grade(grade):
    if grade < 0 or grade > 100:
        print("La nota debe estar entre 0 y 100.")
        return False
    elif not isinstance(grade, (int,float)):
        raise ValueError('La nota debe ser un número')
    
    return True


def ask_another_student():
    while True:
        response = input("¿Desea ingresar otro estudiante? (s/n): ").strip().lower()
        if response == 's':
            return True
        elif response == 'n':
            return False
        else:
            print("Respuesta no válida. Por favor, ingrese 's' para sí o 'n' para no.")


def calculate_average(grade1, grade2, grade3, grade4):
    return (grade1 + grade2 + grade3 + grade4) / 4



def get_student_data(students):
    while True:
        name = input("Ingrese el nombre del estudiante: ")
        last_name = input("Ingrese los apellidos del estudiante: ")
        section = input("Ingrese la sección del estudiante: ")
        
        valid = False
        while not valid:
            spanish_grade = float(input("Ingrese la nota de español del estudiante: "))
            english_grade = float(input("Ingrese la nota de inglés del estudiante: "))
            social_studies_grade = float(input("Ingrese la nota de estudios sociales del estudiante: "))
            science_grade = float(input("Ingrese la nota de ciencias del estudiante: "))

            valid = check_valid_grade(spanish_grade) and check_valid_grade(english_grade) and check_valid_grade(social_studies_grade) and check_valid_grade(science_grade) 
        
        average = calculate_average(spanish_grade, english_grade, social_studies_grade, science_grade)

        student_data = {
            "Nombre": name,
            "Apellido": last_name,
            "Sección": section,
            "Notas": f"Español: {spanish_grade}, Inglés: {english_grade}, Sociales: {social_studies_grade}, Ciencias {science_grade}",
            "Promedio": average
        }

        add_student(students, student_data)

        ask_another = ask_another_student()
        if not ask_another:
            break
            
    return student_data


# Funciones para el manejo de datos de los estudiantes
def add_student(students, student_data):
    students.append(student_data)
    print(f"Estudiante {student_data['Nombre']} {student_data['Apellido']} agregado con éxito.")


def view_students(students):
    if len(students) == 0:
        print("No hay estudiantes registrados.")
        
        return
        

    print("Lista de Estudiantes:")
    for student in students:
        print(f"{student['Nombre']} {student['Apellido']} - Sección: {student['Sección']} - Notas: {student['Notas']} - Promedio: {student['Promedio']}")


# Funciones para ver el top 3 de estudiantes sin usar sorted
def get_top_students(students):
    while True:
        top_students = []
        for _ in range(3):
            max_average = -1
            top_student = None
            for student in students:
                if student['Promedio'] > max_average and student not in top_students:
                    max_average = student['Promedio']
                    top_student = student
            if top_student:
                top_students.append(top_student)
        
        if len(students) == 0:
            print("No hay estudiantes registrados.")
            break

        return top_students

def view_top_students(students):
    top_students = get_top_students(students)
    if top_students:
        print("Top 3 Estudiantes:")
        for student in top_students:
            print(f"{student['Nombre']} {student['Apellido']} - Promedio: {student['Promedio']}")
    

# Función para ver el promedio del curso
def get_course_average(students):
    if len(students) == 0:
        print("No hay estudiantes registrados.")

    total_students_average = 0
    for student in students:
        total_students_average += student['Promedio']

    total_average = total_students_average / len(students)

    return f'El promedio total de los estudiantes del curso es de {total_average}'




    





        