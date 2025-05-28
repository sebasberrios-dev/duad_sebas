#Testing bubble sort
import pytest
import random
from bubble_sort_2 import bubble_sort

def test_bubble_sort_with_a_small_list():
    # Arrange
    small_list = [6,9,3]

    # Act
    result = bubble_sort(small_list)

    # Assert
    assert result == [3,6,9]


def test_bubble_sort_with_a_big_list():
    # Arrange
    big_list = list(range(0,131))
    random.shuffle(big_list)
    list_to_compare = list(range(0,131))

    # Act
    result = bubble_sort(big_list)

    # Assert 
    assert result == list_to_compare
    



def test_bubble_sort_with_an_empty_list():
    # Arrange
    empty_list = []

    # Act
    result = bubble_sort(empty_list)

    # Assert   
    assert result == False 


def test_bubble_sort_without_a_list_as_a_parameter():
    # Arrange
    no_list = 'Hola'

    # Act & Assert
    with pytest.raises(TypeError):
        bubble_sort(no_list)