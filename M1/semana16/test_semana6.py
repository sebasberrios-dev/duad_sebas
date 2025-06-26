import pytest
from ejercicios_semana6 import sum_list, reverse_string, count_case, sort_string, is_prime, get_number

# Ejercicio 3
def test_sum_list_with_big_numbers():
    # Arrange
    big_numbers_list = [789, 574, 950]

    # Act
    result = sum_list(big_numbers_list)

    # Assert
    assert result == 2313


def test_sum_list_with_small_numbers():
    # Arrange
    small_numbers_list = [5, 6, 3, 7, 10, 4]

    # Act
    result = sum_list(small_numbers_list)

    # Assert
    assert result == 35


def test_sum_list_with_negative_numbers():
    # Arrange
    negative_numbers_list = [-3, -6, -8, -10]

    # Act
    result = sum_list(negative_numbers_list)

    # Assert 
    assert result == -27

# Ejercicio 4
def test_reverse_string_with_one_word():
    # Arrange
    word = 'Hospital'

    # Act
    result = reverse_string(word)

    # Assert 
    assert result == 'latipsoH'


def test_reverse_string_with_a_sentence():
    # Arrange
    sentence = 'María está leyendo un libro.'
    

    # Act
    result = reverse_string(sentence)

    # Assert
    assert result == '.orbil nu odneyel átse aíraM'


def test_reverse_string_with_no_string():
    # Arrange
    no_string = 4

    # Act & Assert
    with pytest.raises(TypeError):
        reverse_string(no_string)
    
# Ejercicio 5
def test_count_case_in_a_sentence_with_all_capital_letters():
    # Arrange
    sentence = 'MARÍA ESTÁ LEYENDO UN LIBRO.'

    # Act
    result = count_case(sentence)

    # Assert
    assert result == f'La oración MARÍA ESTÁ LEYENDO UN LIBRO. tiene 23 mayúsculas y 0 minúsculas.'


def test_count_case_in_a_sentence_with_all_lowercase_letters():
    # Arrange
    sentence = 'maría está leyendo un libro.'

    # Act
    result = count_case(sentence)

    # Assert
    assert result == f'La oración maría está leyendo un libro. tiene 0 mayúsculas y 23 minúsculas.'


def test_count_case_in_a_sentence_with_capital_and_lowercase_letters():
    # Arrange
    sentence = 'mARía EsTá lEYeNdO uN lIbRo.'

    # Act
    result = count_case(sentence)

    # Assert
    assert result == f'La oración mARía EsTá lEYeNdO uN lIbRo. tiene 11 mayúsculas y 12 minúsculas.'

# Ejercicio 6
def test_sort_string_with_an_alphabetically_unordered_string():
    # Arrange
    unordered_string = 'Vaca-Perro-Traste-Bonito-Arco'

    # Act
    result = sort_string(unordered_string)

    # Assert
    assert result == 'Arco-Bonito-Perro-Traste-Vaca'


def test_sort_string_with_an_alphabetically_ordered_string():
    # Arrange
    ordered_string = 'Abeja-Buey-Cuerda-Dedo-Rana'

    # Act
    result = sort_string(ordered_string)

    # Assert
    assert result == 'La lista ya está ordenada'


def test_sort_string_with_words_separated_by_a_comma():
    # Arrange
    comma_string = 'Vaca, Perro, Traste, Bonito, Arco'

    # Act
    result = sort_string(comma_string)

    # Assert
    assert result == 'Debes separar las palabras solo con guiones'

# Ejercicio 7
def test_is_prime_with_all_prime_numbers():
    prime_numbers = [2, 3, 5, 7, 11, 13, 17, 19]

    # Act
    result = get_number(prime_numbers)

    # Assert
    assert result == [2, 3, 5, 7, 11, 13, 17, 19]

def test_is_prime_without_prime_numbers():
    # Arrange
    no_prime_numbers = [1, 4, 6, 10, 12, 16, 20]

    # Act
    result = get_number(no_prime_numbers)

    # Assert
    assert result == 'La lista no contiene números primos.'


def test_is_prime_with_an_empty_list():
    # Arrange 
    empty_list = []

    # Act
    result = get_number(empty_list)

    # Assert 
    assert result == 'Tienes que añadir números a la lista.'


