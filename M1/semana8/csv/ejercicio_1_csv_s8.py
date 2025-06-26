# Ejercicio 1
import csv
# Funcion para guardar informacion de los videojuegos en diccionarios
def save_video_game_data(name, gender, developer, classification):
    video_game_dict = {
        'nombre': name,
        'genero': gender,
        'desarrollador': developer,
        'clasificacion': classification
    }

    return video_game_dict


# Funcion para guardar la informacion en un archivo CSV y verificar si existe
def write_csv_file(file_path, data, headers):
    file_exists = False 
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            file_exists = True
    
    except FileNotFoundError:
        pass

    with open(file_path, 'a', encoding='utf-8') as file:
        writer = csv.DictWriter(file, headers)
        if not file_exists:
            writer.writeheader()
        writer.writerows(data)


# Funcion principal
def main():
    video_game_list = []    
    counter = 0
    number_of_video_games = int(input("¿Cuántos videojuegos desea ingresar?: "))
    
    while (counter < number_of_video_games):
        counter += 1
        name = input(f"Nombre del videojuego {counter}: ")
        gender = input(f"Género del videojuego: ")
        developer = input(f"Desarrollador del videojuego: ")
        classification = input(f"Clasificación del videojuego: ")
        video_game_dict = save_video_game_data(name, gender, developer, classification)
        video_game_list.append(video_game_dict)
    
    file_path = 'videojuegos.csv'
    video_game_headers = (
        'nombre',
        'genero',
        'desarrollador',
        'clasificacion'
    )
    write_csv_file(file_path, video_game_list, video_game_headers)
    print(f"Se han guardado {number_of_video_games} videojuegos en el archivo {file_path}.")


if __name__ == "__main__":
    main()    