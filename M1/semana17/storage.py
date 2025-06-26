# Funciones para guardar y cargar datos desde archivos CSV
import csv
from logic import Category, Transaction, FinanceManager

# Funciones para guardar datos del archivo CSV
def save_categories_to_csv(manager, filename):
    header = ['Nombre']
    # Abre el archivo en modo escritura para sobrescribir datos previos
    with open(filename, 'w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=header, delimiter='\t')
        writer.writeheader()  # Escribe la linea de encabezados
        # Escribe cada categoría en una linea
        for category in manager.get_categories():
            writer.writerow({'Nombre': category.name})

# Misma lógica que el archivo de categorías
def save_transactions_to_csv(manager, filename):
    headers = ['Título', 'Monto', 'Categoría', 'Tipo']
    with open(filename, 'w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers, delimiter='\t')
        writer.writeheader()  
        for transaction in manager.get_transactions():
            writer.writerow({
                'Título': transaction.title,
                'Monto': transaction.amount,
                'Categoría': transaction.category.name,
                'Tipo': transaction.type_
            })

# Funciones para cargar datos del archivo CSV
def load_categories_from_csv(manager, filename):
    try:
        # Abre el archivo para lectura y crea un lector CSV 
        with open(filename, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter='\t')
            for row in reader:
                name = row['Nombre']
                try:
                    # Intenta agregar la categoría al manager (ignora duplicados)
                    manager.add_category(name)
                except ValueError:
                    pass
    except FileNotFoundError:
        # Si el archivo no existe, simplemente no carga nada
        pass

# Misma lógica que las categorías
def load_transactions_from_csv(manager, filename):
    try:   
        with open(filename, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter='\t')
            for row in reader:
                title = row['Título']
                amount = float(row['Monto'])
                category = row['Categoría']
                type_ = row['Tipo']
                try:
                    manager.add_transaction(title, amount, category, type_)
                except ValueError:
                    pass
    except FileNotFoundError:
        pass




