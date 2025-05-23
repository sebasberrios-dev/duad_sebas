def inverted_bubble_sort(list_to_sort):
    initial_list = list_to_sort
    print(f'Lista inicial: {initial_list}')
    for outer_index in range(len(list_to_sort) -1):
        has_made_changes = False

        for index in range(len(list_to_sort) -1, 0, -1):
            current_element = list_to_sort[index]
            prev_element = list_to_sort[index - 1]
            print(f'- Iteración: {outer_index}, {index}. Elemento actual: {current_element}. Siguiente elemento: {prev_element}')
            if current_element < prev_element:
                print('El número es menor que el siguiente. Intercambiando...')
                list_to_sort[index] = prev_element
                list_to_sort[index - 1] = current_element
                has_made_changes = True

        if not has_made_changes:
            print('La lista ya está acomodada correctamente.')
            return

    final_list = list_to_sort
    print(f'Lista final: {final_list}')    


my_list = [9, 8, 7, 6, 5, 4, 3, 2, 1]

inverted_bubble_sort(my_list)

