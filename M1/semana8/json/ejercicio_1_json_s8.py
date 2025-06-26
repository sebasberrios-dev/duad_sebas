# Ejercicio 1
import json

#Funcion para leer un archivo JSON y verificar si existe
def read_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        return []


#Funcion para pedir informacion del pokemon a ingresar 
def ask_for_pokemon_data():
    name = input("Nombre del pokemon (Inglés): ")
    type = input("Tipo del pokemon: ")
    hp = int(input("HP del pokemon: "))
    attack = int(input("Ataque del pokemon: "))
    defense = int(input("Defensa del pokemon: "))
    special_attack = int(input("Ataque especial del pokemon: "))
    special_defense = int(input("Defensa especial del pokemon: "))
    speed = int(input("Velocidad del pokemon: "))

    return {
        'name': {
            'english': name
        },
        'type': [type],
        'base': {
            'HP': hp,
            'Attack': attack,
            'Defense': defense,
            'Sp. Attack': special_attack,
            'Sp. Defense': special_defense,
            'Speed': speed
        }
    }


#Funcion para guardar la informacion en un archivo JSON 
def write_json(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)
    
#Funcion principal
def main():
    counter = 0
    file_path = 'pokemones.json'
    pokemon_list = read_json(file_path)
    number_of_pokemons = int(input("¿Cuántos pokemones desea ingresar?: "))
    while (counter < number_of_pokemons):
        counter += 1
        pokemon_data = ask_for_pokemon_data()
        pokemon_list.append(pokemon_data)
    write_json(file_path, pokemon_list)
    print(f"Se han guardado {number_of_pokemons} pokemones en el archivo {file_path}.")

if __name__ == "__main__":
    main()