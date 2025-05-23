def bubble_sort(list_to_sort):
    print(f'Lista inicial: {list_to_sort}')
    list_length = len(list_to_sort)

    for outer_index in range(list_length):
        has_made_changes = False
        print(f'\n--- Pasada {outer_index + 1} ---')

        for index in range(list_length - 1 - outer_index):
            current_element = list_to_sort[index]
            next_element = list_to_sort[index + 1]

            print(f'- Comparando {current_element} y {next_element} en posiciones {index} y {index + 1}')

            if current_element > next_element:
                print('  Intercambiando...')
                list_to_sort[index], list_to_sort[index + 1] = next_element, current_element
                has_made_changes = True
            else:
                print('  No se intercambia.')

        print(f'Lista después de la pasada {outer_index + 1}: {list_to_sort}')

        if not has_made_changes:
            print('La lista ya está ordenada. Terminando antes.')
            break

    print(f'\nLista final ordenada: {list_to_sort}')

my_list = [9, 8, 7, 6, 5, 4, 3, 2, 1]
bubble_sort(my_list)
