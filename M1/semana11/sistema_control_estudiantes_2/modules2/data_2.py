#data_2.py
# Librerías necesarias 
import csv 

# Funciones para exportar e importar datos de estudiantes

def verify_file(file_name):
    file_exists = False
    try:
        with open(file_name, 'r', encoding='utf-8') as file:
            file_exists = True
    except FileNotFoundError:
        pass
    
    return file_exists

def export_students_data(students, file_name, headers):
    with open(file_name, 'w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers, delimiter='\t')
        writer.writeheader()
        for student in students:
            writer.writerow({
                'Nombre': student.name,
                'Apellido': student.last_name,
                'Sección': student.section,
                'Notas': f"Español: {student.spanish_grade}, Inglés: {student.english_grade}, "
                         f"Sociales: {student.social_studies_grade}, Ciencias: {student.science_grade}",
                'Promedio': student.average
            })
        print(f"Datos de estudiantes exportados a {file_name} con éxito.")



from modules2.actions_2 import Student

def import_students_data(file_name, students):
    if not verify_file(file_name):
        print(f"El archivo {file_name} no existe.")
        return 

    with open(file_name, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        for row in reader:
            avrg = float(row['Promedio'])
            grades = row['Notas'].split(',')
            esp = float(grades[0].split(':')[1])
            eng = float(grades[1].split(':')[1])
            soc = float(grades[2].split(':')[1])
            sci = float(grades[3].split(':')[1])

            student = Student(
                name=row['Nombre'],
                last_name=row['Apellido'],
                section=row['Sección'],
                spanish_grade=esp,
                english_grade=eng,
                social_studies_grade=soc,
                science_grade=sci,
                average=avrg
            )
            students.append(student)

        print(f"Datos de estudiantes importados desde {file_name} con éxito.")
