#Librerías y modulos necesarios
from modules.actions import view_students, get_top_students, get_student_data, view_top_students, get_course_average
from modules.data import export_students_data, import_students_data

def get_menu(students, file_name, headers):
    while True:
        try:
            print("\nSistema de Control de Estudiantes")
            print("1. Agregar Estudiante")
            print("2. Ver Estudiantes")
            print("3. Top 3 de clase")
            print("4. Promedio de clase")
            print("5. Exportar datos")
            print("6. Importar datos")
            print("7. Salir")

            opt = input("\nSeleccione una opción: ")

            if opt == '1':
                get_student_data(students)
            
            elif opt == '2':
                view_students(students)
            
            elif opt == '3':
                view_top_students(students)
            
            elif opt == '4':
                total_average = get_course_average(students)
                print(total_average)
            
            elif opt == '5':
                export_students_data(students, file_name, headers)
            
            elif opt == '6':
                import_students_data(file_name, students)
            
            elif opt == '7':
                print("Saliendo del sistema...")
                break
            
            elif opt == '8':
                print(students)
                
            else:
                print("Opción no válida. Intente nuevamente.")
        
        except ValueError as e:
            print(f"Error: La entrada tiene que ser un número. {e}")
        
        except ZeroDivisionError:
            print("Error: Debe haber estudiantes registrados para realizar la operación")
        
        except IndexError:
            print("Error: Debe haber datos para exportar al archivo")

        

    

