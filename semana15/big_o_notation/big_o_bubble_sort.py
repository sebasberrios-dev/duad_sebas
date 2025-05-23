def bubble_sort(list_to_sort):
  for outer_index in range(0, len(list_to_sort) - 1): # O(n)
    has_made_changes = False

    for index in range(0, len(list_to_sort) - 1 - outer_index): # O(n^2)
      current_element = list_to_sort[index]
      next_element = list_to_sort[index + 1]

      print(f'-- Iteracion {outer_index}, {index}. Elemento actual: {current_element}, Siguiente elemento: {next_element}')

      if current_element > next_element:
        print('El elemento actual es mayor al siguiente. Intercambiandolos...')
        list_to_sort[index] = next_element
        list_to_sort[index + 1] = current_element
        has_made_changes = True

    if not has_made_changes:
      return


my_test_list = [1, 2, 3, 10, 4, 5, 6, 7, 8]
bubble_sort(my_test_list)

print(my_test_list)