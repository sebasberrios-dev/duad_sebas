# Interfaz gráfica para interactuar con el gestor
import PySimpleGUI as sg
import logic
import storage

# Inicializa el manager
fm = logic.FinanceManager()

# Archivos donde se almacenan datos
category_file = 'category.csv'
transactions_file = 'transactions.csv'

# Carga datos guardados en archivos CSV al iniciar
storage.load_categories_from_csv(fm, category_file)
storage.load_transactions_from_csv(fm, transactions_file)

# Diseño de la ventana: tabla para mostrar transacciones y botones para acciones
layout = [
    [sg.Table(
        values=[['', '', '', '']], 
        headings=['Título', 'Monto', 'Categoría', 'Tipo'],  
        key='-TABLE-',               
        auto_size_columns=True,
        justification='center',
        num_rows=10,
        enable_events=False
    )],
    [sg.Button('Agregar Ingreso'), sg.Button('Agregar Gasto'), sg.Button('Agregar Categoría'), sg.Button('Salir')]
]

# Crear ventana con finalize=True para poder actualizar elementos antes de leer eventos
window = sg.Window('Gestor de Finanzas', layout, finalize=True)

def update_table():
    # Obtiene todas las transacciones para mostrar en la tabla
    data = [[tx.title, tx.amount, tx.category.name, tx.type_] for tx in fm.get_transactions()]
    if not data:
        data = [['', '', '', '']]  # Si no hay datos, muestra línea vacía
    window['-TABLE-'].update(values=data)  # Actualiza la tabla con datos

update_table()  # Mostrar los datos cargados al iniciar

# Bucle principal de eventos de la interfaz
while True:
    event, values = window.read()

    if event == sg.WIN_CLOSED or event == 'Salir':
        # Al cerrar, guarda las categorías y transacciones a los archivos
        storage.save_categories_to_csv(fm, category_file)
        storage.save_transactions_to_csv(fm, transactions_file)
        break

    if event == 'Agregar Categoría':
        # Solicita nombre de nueva categoría y la añade
        name = sg.popup_get_text('Nombre de la categoría:')
        try:
            fm.add_category(name)
            sg.popup('Categoría agregada correctamente.')
        except (ValueError, TypeError) as e:
            sg.popup(f'Error: {e}')

    if event == 'Agregar Ingreso':
        # Solicita datos del ingreso y lo añade
        title = sg.popup_get_text('Título del ingreso:')
        amount = sg.popup_get_text('Monto del ingreso:')
        category = sg.popup_get_text('Categoría del ingreso:')
        try:
            fm.add_income(title, amount, category)
            sg.popup('Ingreso agregado correctamente.')
            update_table()  # Actualiza la tabla para mostrar nuevo ingreso
        except (ValueError, TypeError) as e:
            sg.popup(f'Error: {e}')

    if event == 'Agregar Gasto':
        # Solicita datos del gasto y lo añade
        title = sg.popup_get_text('Título del gasto:')
        amount = sg.popup_get_text('Monto del gasto:')
        category = sg.popup_get_text('Categoría del gasto:')
        try:
            fm.add_expense(title, amount, category)
            sg.popup('Gasto agregado correctamente.')
            update_table()  # Actualiza la tabla para mostrar nuevo gasto
        except (ValueError, TypeError) as e:
            sg.popup(f'Error: {e}')

window.close()

