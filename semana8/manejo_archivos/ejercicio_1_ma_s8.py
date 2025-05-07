# Ejercicio 1

# Funcion para abrir y leer un archivo
def open_and_read_file(path):
    counter = 0
    with open(path) as file:
        for line in file.readlines():
            counter += 1
            print(f'Canción {counter}: {line}')

# Funcion para ordenar canciones
def sort_songs(path):
    with open(path) as file:
        songs = file.readlines()
        songs.sort()
    return songs

# Funcion para escribir canciones ordenadas en un nuevo archivo
def write_sorted_songs(path, sorted_songs):
    with open(path, 'w', encoding='utf-8') as file:
        for song in sorted_songs:
            file.write(song)


def main():
    path = 'canciones.txt' 
    open_and_read_file(path)
    sorted_songs = sort_songs(path)
    new_path = 'canciones_ordenadas.txt'
    write_sorted_songs(new_path, sorted_songs)
    print(f'Canciones ordenadas y guardadas en {new_path}')

if __name__ == "__main__":
    main()
