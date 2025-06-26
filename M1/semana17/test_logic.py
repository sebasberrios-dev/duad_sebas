# Pruebas unitarias para verificar la lógica del gestor 

import pytest
from logic import FinanceManager, Category, Transaction

# Prueba que se cree una nueva categoría 
def test_add_new_category():
   # Arrange 
    fm = FinanceManager()

    # Act
    cat = fm.add_category('Comida')
    
    # Assert
    assert cat.name == 'Comida'

#Prueba que se añada la nueva categoría a la lista
def test_add_new_category_to_the_list():
    # Arrange
    fm = FinanceManager()

    # Act
    fm.add_category('Transporte')
    
    # Assert
    assert len(fm.get_categories()) == 1

# Prueba que lance error cuando la categoría está duplicada
def test_error_when_the_category_is_duplicate():
    # Arrange
    fm = FinanceManager()

    # Act & Assert
    fm.add_category('Entretenimiento')
    with pytest.raises(ValueError):
        fm.add_category('Entretenimiento')

# Prueba que se cree un nuevo ingreso
def test_add_new_expense():
    # Arrange
    fm = FinanceManager()
    fm.add_category('Entretenimiento')

    # Act
    tx = fm.add_expense('Cine', 15, 'Entretenimiento')
    
    # Assert
    assert tx.title == 'Cine'
    assert tx.amount == 15
    assert tx.category.name == 'Entretenimiento'
    assert tx.type_ == 'Gasto'

# Prueba que se cree un nuevo gasto
def test_add_new_income():
    # Arrange
    fm = FinanceManager()
    fm.add_category('Trabajo')

    # Act
    tx = fm.add_income('Sueldo', 1000, 'Trabajo')
    # Assert
    assert tx.title == 'Sueldo'
    assert tx.amount == 1000
    assert tx.category.name == 'Trabajo'
    assert tx.type_ == 'Ingreso'

# Prueba que las transacciones se añadan a la lista
def test_add_transaction_to_the_list():
    # Arrange
    fm = FinanceManager()
    fm.add_category('Trabajo')

    # Act
    fm.add_income('Sueldo', 1000, 'Trabajo')
    
    # Assert
    assert len(fm.get_transactions()) == 1

# Prueba que lance error si el monto es negativo
def test_error_when_amount_is_negative():
    # Arrange
    fm = FinanceManager()
    fm.add_category('Trabajo')
    fm.add_category('Entretenimiento')

    # Act & Assert
    with pytest.raises(ValueError):
        fm.add_income('Sueldo', -1000, 'Trabajo')

    with pytest.raises(ValueError):
        fm.add_expense('Cine', -15, 'Entretenimiento')

# Prueba que lance error si la categoría de la transacción no existe
def test_error_when_the_transaction_has_invalid_category():
    # Arrange
    fm = FinanceManager()

    # Act & Assert
    fm.add_category('Transporte')
    with pytest.raises(ValueError):
        fm.add_expense('Uber', 5, 'Comida')
