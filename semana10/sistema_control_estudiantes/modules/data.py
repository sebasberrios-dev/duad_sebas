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

def export_students_data(students, file_name,headers):
    with open(file_name, 'w', encoding= 'utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=headers, delimiter='\t')
        writer.writeheader()
        writer.writerows(students)
        print(f"Datos de estudiantes exportados a {file_name} con éxito.")


def import_students_data(file_name, students):
    if not verify_file(file_name):
        print(f"El archivo {file_name} no existe.")
        return 
         
    
    with open(file_name, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        for row in reader: 
            if row not in students:
               students.append(row)
            
        print(f"Datos de estudiantes importados desde {file_name} con éxito.")


                
    

