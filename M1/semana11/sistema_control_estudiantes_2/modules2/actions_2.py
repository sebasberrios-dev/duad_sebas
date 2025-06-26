#actions_2.py
class Student():
    def __init__(self, name, last_name, section, spanish_grade, english_grade, social_studies_grade, science_grade, average):
        self.name = name
        self.last_name = last_name
        self.section = section
        self.spanish_grade = spanish_grade
        self.english_grade = english_grade
        self.social_studies_grade = social_studies_grade
        self.science_grade = science_grade
        self.average = average

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

        student = Student(name, last_name, section, spanish_grade, english_grade, 
                    social_studies_grade, science_grade, average)
        

        add_student(students, student)

        ask_another = ask_another_student()
        if not ask_another:
            break
            
    return students


# Funciones para el manejo de datos de los estudiantes
def add_student(students, student):
    students.append(student)
    print(f"Estudiante {student.name} {student.last_name} agregado con éxito.")


def view_students(students):
    if len(students) == 0:
        print("No hay estudiantes registrados.")
        
        return
        

    print("Lista de Estudiantes:")
    for student in students:
        print(f"{student.name} {student.last_name} - Sección: {student.section} - "
              f"Notas: Español: {student.spanish_grade}, Inglés: {student.english_grade}, "
              f"Sociales: {student.social_studies_grade}, Ciencias: {student.science_grade} - "
              f"Promedio: {student.average}")


# Funciones para ver el top 3 de estudiantes sin usar sorted
def get_top_students(students):
    if len(students) == 0:
        print("No hay estudiantes registrados.")
        return []

    top_students = []
    for _ in range(min(3, len(students))):
        max_average = -1
        top_student = None
        for student in students:
            if student.average > max_average and student not in top_students:
                max_average = student.average
                top_student = student
        if top_student:
            top_students.append(top_student)

    return top_students


def view_top_students(students):
    top_students = get_top_students(students)
    if top_students:
        print("Top 3 Estudiantes:")
        for student in top_students:
            print(f"{student.name} {student.last_name} - Promedio: {student.average}")
    

# Función para ver el promedio del curso
def get_course_average(students):
    if len(students) == 0:
        return "No hay estudiantes registrados."

    total_students_average = sum(student.average for student in students)
    total_average = total_students_average / len(students)

    return f'El promedio total de los estudiantes del curso es de {total_average:.2f}'
