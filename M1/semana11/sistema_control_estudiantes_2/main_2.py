#main_2.py
from modules2.menu_2 import *

def main(): 
    students = [] 
    file_name = 'estudiantes_2.csv'
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
