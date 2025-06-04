# Define las clases y la lógica del gestor

class Category:
    def __init__(self, name):
        self.name = name  # Nombre de la categoría
    

class Transaction:
    def __init__(self, title, amount, category, type_):
        self.title = title       # Título o descripción de la transacción
        self.amount = amount     # Monto de la transacción
        self.category = category # Objeto Category asociado
        self.type_ = type_       # Tipo: 'Ingreso' o 'Gasto'


class FinanceManager:
    def __init__(self):
        self.categories = []    # Lista para almacenar categorías
        self.transactions = []  # Lista para almacenar transacciones

    def add_category(self, name):
        # Verifica si la entrada está vacía o es None
        if name is None or not name.strip():
            raise TypeError('El nombre de la categoría no puede estar vacío.')
        name = name.strip()

        # Añade una nueva categoría si no existe ya con ese nombre
        if not any(cat.name == name for cat in self.categories):
            new_category = Category(name)
            self.categories.append(new_category) 
            return new_category
        else:
            raise ValueError(f'La categoría "{name}" ya existe.')

    def add_transaction(self, title, amount, category_name, type_):
        # Validación de entrada
        if title is None or not title.strip():
            raise TypeError('Debe ingresar un título.')
        if category_name is None or not category_name.strip():
            raise TypeError('Debe ingresar una categoría.')
        if amount is None or not str(amount).strip():
            raise TypeError('Debe ingresar un monto.')

        title = title.strip()
        category_name = category_name.strip()

        # Verifica que el monto sea numérico y sea mayor a cero
        try:
            amount = float(amount)
        except ValueError:
            raise ValueError('El monto debe ser un número válido.')

        if amount < 0:
            raise ValueError('El monto no puede ser negativo.')

        # Busca la categoría en la lista por nombre
        category = next((cat for cat in self.categories if cat.name == category_name), None)
        if not category:
            raise ValueError(f'La categoría "{category_name}" no existe.')

        # Crea y agrega la transacción a la lista
        new_transaction = Transaction(title, amount, category, type_)
        self.transactions.append(new_transaction)
        return new_transaction

    def add_income(self, title, amount, category_name):
        # Añade una transacción tipo ingreso
        return self.add_transaction(title, amount, category_name, 'Ingreso')

    def add_expense(self, title, amount, category_name):
        # Añade una transacción tipo gasto
        return self.add_transaction(title, amount, category_name, 'Gasto')

    def get_transactions(self):
        # Retorna todas las transacciones almacenadas
        return self.transactions
    
    def get_categories(self):
        # Retorna todas las categorías almacenadas
        return self.categories



    
    

