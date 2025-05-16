# Pide y muestra información de estudiantes que estudian con beca deportiva
# por medio de una clase que hereda funciones y atributos de otras 3 clases

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def show_info(self):
        print(f'Nombre del estudiante: {self.name}\n'
              f'Edad: {self.age}')
    
class Student:
    def __init__(self, student_id, career):
        self.student_id = student_id
        self.career = career

    def show_academic_info(self):
        print(f'ID de estudiante: {self.student_id}\n'
              f'Carrera: {self.career}')
    
class Athlete:
    def __init__(self, sport, institute):
        self.sport = sport
        self.institute = institute
    
    def show_sports_info(self):
        print(f'Deporte: {self.sport}\n'
              f'Universidad: {self.institute}')

class StudentAthlete(Person, Student, Athlete):
    def __init__(self, name, age, student_id, career, sport, institute):
        Person.__init__(self, name, age)
        Student.__init__(self, student_id, career)
        Athlete.__init__(self, sport, institute)
    
    def show_all_info(self):
        print('\n=== Información del estudiante ===')
        self.show_info()
        self.show_academic_info()
        self.show_sports_info()

name = input('Ingrese su nombre completo: ')
age = int(input('Ingrese su edad: '))
student_id = input('Ingrese su ID de estudiante: ')
career = input('Ingrese la carrera que está cursando: ')
sport = input('Ingrese el deporte que practica: ')
institute = input('Ingrese la univerdad en que estudia: ')

first_student = StudentAthlete(
    name = name,
    age = age,
    student_id = student_id,
    career = career,
    sport = sport,
    institute = institute
)

first_student.show_all_info()