from modules.menu import *

def main(): 
    students = [] 
    file_name = 'estudiantes.csv'
    headers = (
        'Nombre',
        'Apellido',
        'Sección',
        'Notas',
        'Promedio'
    )
    get_menu(students, file_name, headers)

if __name__ == '__main__':
    main()
